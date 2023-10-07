import json
import datetime
import uuid
from google.cloud import datastore
from pytz import timezone
import base64
import json
import traceback


headers = {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}
### Global Variables
client = datastore.Client()


def getEvents(request):
    email = ""
    guestname = ""
    guestid = ""
    airbnbid = ""
    phonenum = ""
    nightlyrate = ""
    infants = ""
    children = ""
    adults = ""
    orig_email = ""

    # Get the email passed into the function
    request_args = request.args

    if "Authorization" in request.headers:
        try:
            email = json.loads(base64.b64decode(request.headers["X-Apigateway-Api-Userinfo"] + "==").decode("utf-8"))[
                "email"
            ]
            orig_email = email

        except:
            pass

        try:
            if request_args and "adults" in request_args:
                adults = str(request_args["adults"])

            if request_args and "children" in request_args:
                children = str(request_args["children"])

            if request_args and "infants" in request_args:
                infants = str(request_args["infants"])

            if request_args and "nightlyrate" in request_args:
                nightlyrate = str(request_args["nightlyrate"])

            if request_args and "guestname" in request_args:
                guestname = str(request_args["guestname"])

            if request_args and "guestid" in request_args:
                guestid = str(request_args["guestid"])

            if request_args and "phonenum" in request_args:
                phonenum = str(request_args["phonenum"])

           
            timestr = datetime.datetime.now().replace(microsecond=0)

            print("Creating new Reservation")
            # Here is where we add a new event
            new_uuid = str(uuid.uuid1())
            print("New UUID is " + new_uuid)

          
            new_reservation = {
                "uid": new_uuid,
                "status": "Reserved",
                "created_date": timestr,
                "created_by": orig_email,
                "booked": timestr,
                "calendar_type": "custom",
                "notes": [],
                "backfill": "false",
                "updated": timestr,
                "lastUpdateTime": timestr,
                "phonenum": phonenum,
                "description": "",
                "cleanerid": "",
                "cleanername": "",
                "cleanerpaid": "false",
                "cleanerpaidpaymenttype": "",
                "cleanerconfirmationstatus": "",
                "cleanerconfirmationdate": "",
                "cleanerrequestedtime": "",
                "cleanerpaidpaymentdate": "",
                "airbnbreservationid": "",
                "bookingstatus": "reserved",
                "listing": airbnbid,
                "guestname": guestname,
                "guestid": guestid,
                "nightlyrate": nightlyrate,
                "count_adults": adults,
                "count_children": children,
                "count_infants": infants,
                "manuallyconfirmedby": "",
            }
            print(new_reservation)

            key = client.key(
                "shared",
                "vehicle",
                str(new_uuid),
                0,
                None
            )
        
            entity = datastore.Entity(key=key)
            entity.update(new_reservation)
            client.put(entity)
            return (
                {
                    "status": "success",
                    "message": "Vehicle Added",
                    "uid": str(new_uuid),
                    "reservation": new_reservation,
                },
                200,
                headers,
            )
        except Exception as e:
            error = True
            print(e)
            print(traceback.format_exc())

            return (
                {"status": "error", "message": "Couldn't Add Reservation"},
                500,
                headers,
            )

