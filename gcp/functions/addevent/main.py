import json
import datetime
import uuid
from google.cloud import datastore
from pytz import timezone
import base64
import json
import google.auth.transport.requests
import google.oauth2.id_token
import requests
import traceback


headers = {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}
### Global Variables
client = datastore.Client()


def getEvents(request):
    email = ""
    guestname = ""
    guestid = ""
    checkin = ""
    checkout = ""
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

    # Check if this is a cohost for this listing
    auth_req = google.auth.transport.requests.Request()
    id_token = google.oauth2.id_token.fetch_id_token(auth_req, "https://returnlistings-xmr67kfgoa-uk.a.run.app")

    # Get the host information for this listing so we can also return the email address
    res = requests.get(
        "https://returnlistings-xmr67kfgoa-uk.a.run.app",
        headers={
            "Authorization": "Bearer " + id_token,
            "Content-Type": "application/json",
        },
    )
    host_info = res.json()

    if request_args and "airbnbid" in request_args:
        airbnbid = str(request_args["airbnbid"])

    error = False
    try:
        for listing in host_info["listings"]:
            if error == True:
                break
            print(airbnbid)
            print("Listing we're looking at is " + listing["listing"])
            if airbnbid == "":
                continue
            if airbnbid == listing["listing"]:
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

                    if request_args and "checkout" in request_args:
                        checkout_str = str(request_args["checkout"])
                        checkout = datetime.datetime.strptime(checkout_str, "%Y-%m-%d %H:%M:%S")

                    if request_args and "checkin" in request_args:
                        checkin_str = str(request_args["checkin"])
                        checkin = datetime.datetime.strptime(checkin_str, "%Y-%m-%d %H:%M:%S")

                    timestr = datetime.datetime.now().replace(microsecond=0)

                    print("Creating new Reservation")
                    # Here is where we add a new event
                    new_uuid = str(uuid.uuid1())
                    print("New UUID is " + new_uuid)

                    # Configuring Start Date
                    checkin = datetime.datetime(
                        checkin.year, checkin.month, checkin.day, 0, 0, 0, tzinfo=timezone("EST")
                    )

                    # Configuring End Date
                    checkout = datetime.datetime(
                        checkout.year, checkout.month, checkout.day, 0, 0, 0, tzinfo=timezone("EST")
                    )

                    new_reservation = {
                        "uid": new_uuid,
                        "status": "Reserved",
                        "end_date": checkout,
                        "cleaning_date": checkout,
                        "start_date": checkin,
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

                    # If the person making this request is a cohost, do this
                    if listing["hostemail"] != email:
                        print("This is a cohost")
                        key = client.key(
                            "user",
                            listing["hostemail"],
                            "type",
                            "reservations",
                            "listingid",
                            airbnbid,
                            "reservationid",
                            new_uuid,
                        )
                    # If this person is the host just use the email of the requestor.
                    if listing["hostemail"] == email:
                        print("This is a host")
                        key = client.key(
                            "user", email, "type", "reservations", "listingid", airbnbid, "reservationid", new_uuid
                        )
                    entity = datastore.Entity(key=key)
                    entity.update(new_reservation)
                    client.put(entity)

                    # Check if this is a same day checkin
                    id_token_sameday = google.oauth2.id_token.fetch_id_token(
                        auth_req, "https://checksamedaycheckins-dev-xmr67kfgoa-uk.a.run.app"
                    )
                    print(
                        "https://checksamedaycheckins-dev-xmr67kfgoa-uk.a.run.app/?listing_name=" + listing["listing"]
                    )
                    res = requests.get(
                        "https://checksamedaycheckins-dev-xmr67kfgoa-uk.a.run.app/?listing_name=" + listing["listing"],
                        headers={
                            "Authorization": "Bearer " + id_token_sameday,
                            "Content-Type": "application/json",
                        },
                    )

                    print("Sending Text")

                    auth_req = google.auth.transport.requests.Request()

                    id_token = google.oauth2.id_token.fetch_id_token(
                        auth_req, "https://sendtext-xmr67kfgoa-uk.a.run.app"
                    )

                    # Query for Host
                    host_query = client.query(kind="hostid")
                    host_query.projection = ["uid", "phonenum"]
                    host_query.add_filter("hostemail", "=", email)
                    hosts = host_query.fetch()
                    hosts = list(hosts)

                    # Query for CoHost
                    cohost_query = client.query(kind="cohostid")
                    cohost_query.projection = ["uid", "phonenum"]
                    cohost_query.add_filter("listingid", "=", airbnbid)
                    cohosts = cohost_query.fetch()
                    cohosts = list(cohosts)

                    if "fakecohost" in email or "fakehost" in email or "testname" in guestname:
                        print("This is a fake cohost or fake host or fake event, so don't do anything")
                    else:
                        for cohost in cohosts:
                            requests.post(
                                "https://sendtext-xmr67kfgoa-uk.a.run.app?phonenum="
                                + cohost["phonenum"]
                                + "&message="
                                + "New Booking at "
                                + airbnbid
                                + ". Cleaning needed on "
                                + str(checkout.month)
                                + "/"
                                + str(checkout.day)
                                + "/"
                                + str(checkout.year)
                                + ". More info: https://mysticparking.space/?uid="
                                + new_uuid,
                                headers={"Authorization": "Bearer " + id_token, "Content-Type": "application/json"},
                            )
                    if "fakecohost" in email or "fakehost" in email or "testname" in guestname:
                        print("This is a fake cohost or fake host or fake event, so don't do anything")
                    else:
                        for host in hosts:
                            requests.post(
                                "https://sendtext-xmr67kfgoa-uk.a.run.app?phonenum="
                                + host["phonenum"]
                                + "&message="
                                + "New Booking at "
                                + airbnbid
                                + ". Cleaning needed on "
                                + str(checkout.month)
                                + "/"
                                + str(checkout.day)
                                + "/"
                                + str(checkout.year)
                                + ". More info: https://mysticparking.space/?uid="
                                + new_uuid,
                                headers={"Authorization": "Bearer " + id_token, "Content-Type": "application/json"},
                            )

                    return (
                        {
                            "status": "success",
                            "message": "Reservation Added",
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
            else:
                continue
    except Exception as e:
        print(e)
        print(traceback.format_exc())

        return (
            {"status": "error", "message": "Couldn't Add Reservation"},
            500,
            headers,
        )



