from app import app
from flask import render_template, jsonify
from connect import client
import pymongo

# db = client.crossfit

# Initialize db using default mlab database
db = client.get_default_database()

# Set route
@app.route("/")
def home():

    return (
        f"<h2>Welcome to the Crossfit API!</h2>"
        f"<h5>Available Routes:<h5/><br/>"
        f"/api/v1.0/competitors/ List of competitor names<br/>"
        f"/api/v1.0/competitors/ Enter a year(2017,2018,2019)<year><br/>"
        f"/api/v1.0/score/ Enter a number to filter for top n in event score<topevent><br/>"
        f"/api/v1.0/eventrank/ Enter an event number (1-6)<eventnum>/ Enter a number to filter for the top in event rank<topevent><br/>"
        f"/api/v1.0/eventscore/ Enter an event number (1-6)<eventnum>/ Enter a number to filter for the top in event score<score><br/>"
        f"/api/v1.0/eventyear/ Enter a year (2017,2018,2019)<year>/ Enter an event number(1-6) <eventselection>/ Enter a number to filter top event score<toperank><br/>"
        f"/api/v1.0/yearrank/ Enter a year (2017,2018,2019)<year>/ Enter a number to filter top event rank<erank><br/>"
        f"/api/v1.0/yearscore/ Enter a year (2017,2018,2019)<year>/ Enter a number to filter top event score<escore><br/>"
        f"/api/v1.0/judge/ Enter a year (2017,2018,2019)<year>/ Enter an event number (1-6)<eventselect>/ Enter a number to filter top event score<topeventscore><br/>"
        f"/api/v1.0/judgeselection/<judge><br/>"
        f"/api/v1.0/compselection/<competitor><br/>"
        f"/api/v1.0/competitors/averages/ Enter a number to filter top event score<top><br/>"
        f"/api/v1.0/lookup/ Enter a competitor gender(m,f)<gender>/ Enter a competitor limit <limit><br/>"
        f"/api/v1.0/compinfo/ Enter a competitor name <compname><br/>"
        f"/api/v1.0/averages/comp/ Enter a competitor name <competitor><br/>"
        f"/api/v1.0/affiliates/ List of affiliates"
    )


@app.route("/api/v1.0/competitors")
def names():
    names = db.event_data.find()
    # print()
    comp_names = []
    for n in names:
        comp_names.append(n['Competitor_name'])


    return jsonify(list(set(comp_names)))
    # return render_template('index2.html', =)

@app.route("/api/v1.0/competitors/<year>")
def compyear(year):
    yearx = db.event_data.find({"Event_year":int(year)})
    complist = []
    for y in yearx:
        compyear = {}
        compyear['Competitor Id'] = y['Competitor_id']
        compyear['Competitor Name'] = y['Competitor_name']
        compyear['Event number'] = y['Event_num']
        compyear['Event Score'] = y['Event_score']
        compyear['Event Rank'] = y['Event_rank']
        compyear['Event Score Display'] = y['Event_score_display']
        compyear['Event year'] = y['Event_year']
        compyear['Event Time'] = y['Event_time']
        compyear['Event Judge'] = y['Event_judge']
        complist.append(compyear)
    return jsonify(complist)



@app.route("/api/v1.0/score/<topscore>")
def topscores(topscore):
    topscore = db.event_data.find().sort("Event_score",pymongo.DESCENDING).limit(int(topscore))
    scores = []
    for s in topscore:
        score = {}
        score['Competitor Id'] = s['Competitor_id']
        score['Competitor Name'] = s['Competitor_name']
        score['Event number'] = s['Event_num']
        score['Event Score'] = s['Event_score']
        score['Event Rank'] = s['Event_rank']
        score['Event Score Display'] = s['Event_score_display']
        score['Event year'] = s['Event_year']
        score['Event Time'] = s['Event_time']
        score['Event Judge'] = s['Event_judge']
        scores.append(score)
    return jsonify(scores)



@app.route("/api/v1.0/eventrank/<eventnumrank>/<topevent>")
def eventselectionrank(eventnumrank,topevent):
    eventx = db.event_data.find({"Event_num":int(eventnumrank)}).sort("Event_rank",pymongo.ASCENDING).limit(int(topevent))
    eventlist = []
    for e in eventx:
        event = {}
        event['Competitor Id'] = e['Competitor_id']
        event['Competitor Name'] = e['Competitor_name']
        event['Event number'] = e['Event_num']
        event['Event Score'] = e['Event_score']
        event['Event Rank'] = e['Event_rank']
        event['Event Score Display'] = e['Event_score_display']
        event['Event year'] = e['Event_year']
        event['Event Time'] = e['Event_time']
        event['Event Judge'] = e['Event_judge']
        eventlist.append(event)
    return jsonify(eventlist)


@app.route("/api/v1.0/eventscore/<eventnumscore>/<score>")
def eventselectionscore(eventnumscore,score):
    eventx = db.event_data.find({"Event_num":int(eventnumscore)}).sort("Event_score",pymongo.DESCENDING).limit(int(score))
    eventlist = []
    for e in eventx:
        event = {}
        event['Competitor Id'] = e['Competitor_id']
        event['Competitor Name'] = e['Competitor_name']
        event['Event number'] = e['Event_num']
        event['Event Score'] = e['Event_score']
        event['Event Rank'] = e['Event_rank']
        event['Event Score Display'] = e['Event_score_display']
        event['Event year'] = e['Event_year']
        event['Event Time'] = e['Event_time']
        event['Event Judge'] = e['Event_judge']
        eventlist.append(event)
    return jsonify(eventlist)


@app.route("/api/v1.0/eventyear/<year>/<eventnum>/<toperank>")
def eventyear(year,eventnum,toperank):
    eventbyyear = db.event_data.find({"Event_num":int(eventnum),"Event_year":int(year)}).sort("Event_score",pymongo.DESCENDING).limit(int(toperank))
    eylist = []
    for e in eventbyyear:
        ey = {}
        ey['Competitor Id'] = e['Competitor_id']
        ey['Competitor Name'] = e['Competitor_name']
        ey['Event number'] = e['Event_num']
        ey['Event Score'] = e['Event_score']
        ey['Event Rank'] = e['Event_rank']
        ey['Event Score Display'] = e['Event_score_display']
        ey['Event year'] = e['Event_year']
        ey['Event Time'] = e['Event_time']
        ey['Event Judge'] = e['Event_judge']
        eylist.append(ey)
    return jsonify(eylist)


@app.route("/api/v1.0/yearrank/<year>/<erank>")
def yearrank(year,erank):
    yearandrank = db.event_data.find({"Event_year":int(year)}).sort("Event_rank",pymongo.ASCENDING).limit(int(erank))
    yrrank = []
    for y in yearandrank:
        yrank = {}
        yrank['Competitor Id'] = y['Competitor_id']
        yrank['Competitor Name'] = y['Competitor_name']
        yrank['Event number'] = y['Event_num']
        yrank['Event Score'] = y['Event_score']
        yrank['Event Rank'] = y['Event_rank']
        yrank['Event Score Display'] = y['Event_score_display']
        yrank['Event year'] = y['Event_year']
        yrank['Event Time'] = y['Event_time']
        yrank['Event Judge'] = y['Event_judge']
        yrrank.append(yrank)
    return jsonify(yrrank)


@app.route("/api/v1.0/yearscore/<year>/<escore>")
def yearscore(year,escore):
    yearandscore = db.event_data.find({"Event_year":int(year)}).sort("Event_score",pymongo.DESCENDING).limit(int(escore))
    yrscore = []
    for y in yearandscore:
        yscore = {}
        yscore['Competitor Id'] = y['Competitor_id']
        yscore['Competitor Name'] = y['Competitor_name']
        yscore['Event number'] = y['Event_num']
        yscore['Event Score'] = y['Event_score']
        yscore['Event Rank'] = y['Event_rank']
        yscore['Event Score Display'] = y['Event_score_display']
        yscore['Event year'] = y['Event_year']
        yscore['Event Time'] = y['Event_time']
        yscore['Event Judge'] = y['Event_judge']
        yrscore.append(yscore)
    return jsonify(yrscore)


@app.route("/api/v1.0/judge/<year>/<eventselect>/<topeventscore>")
def judgenames(year,eventselect,topeventscore):
    judges = db.event_data.find({"Event_year":int(year),"Event_num":int(eventselect)}).sort("Event_score",pymongo.DESCENDING).limit(int(topeventscore))
    judge_names = []
    for j in judges:
        judge_names.append(j['Event_judge'])


    return jsonify(list(set(judge_names)))


@app.route("/api/v1.0/judgeselection/<judge>")
def judgeselection(judge):
    judgelist = db.event_data.find({"Event_judge":str(judge)})
    topjudges = []
    for ju in judgelist:
        judgedict = {}
        judgedict['Competitor Id'] = ju['Competitor_id']
        judgedict['Competitor Name'] = ju['Competitor_name']
        judgedict['Event number'] = ju['Event_num']
        judgedict['Event Score'] = ju['Event_score']
        judgedict['Event Rank'] = ju['Event_rank']
        judgedict['Event Score Display'] = ju['Event_score_display']
        judgedict['Event year'] = ju['Event_year']
        judgedict['Event Time'] = ju['Event_time']
        judgedict['Event Judge'] = ju['Event_judge']
        topjudges.append(judgedict)
    return jsonify(topjudges)



@app.route("/api/v1.0/competitors/averages/<top>")
def averages(top):

    pipeline =[
        {"$group":{
            "_id":"$Competitor_name",
            "averagerank": {"$avg":"$Event_rank"}, 
            "averagescore": {"$avg":"$Event_score"},
            "bestrank": {"$min":"$Event_rank"},
            "worstrank": {"$max":"$Event_rank"},
            "minscore":{"$min":"$Event_score"},
            "maxscore":{"$max":"$Event_score"}
            },
        },
        {"$sort":{"Event Score":pymongo.DESCENDING}},
        {"$limit":int(top)},
        { "$project": {
            "averagerank":"$averagerank",
            "averagescore" : "$averagescore",
            "bestrank" : "$bestrank",
            "worstrank" : "$worstrank",
            "minscore" : "$minscore",
            "maxscore" : "$maxscore"}
        }
    ]
    avgs = db.event_data.aggregate(pipeline,allowDiskUse=True)
    avglist = []
    for a in avgs:
        avgentry = {}
        avgentry['Competitor Name'] = a['_id']
        avgentry['Rank Average'] = a['averagerank']
        avgentry['Score Average'] = a['averagescore']
        avgentry['Best Rank'] = a['bestrank']
        avgentry['Worst Rank'] = a['worstrank']
        avgentry['Lowest Score'] = a['minscore']
        avgentry['Highest Score'] = a['maxscore']
        avglist.append(avgentry)
    return jsonify(avglist)


@app.route("/api/v1.0/averages/comp/<competitor>")
def avgpercomp(competitor):


    pipeline =[
        {"$match":{
            "Competitor_name": str(competitor)
        }
        },
        {"$group":{
            "_id":"$Competitor_name",
            "averagerank": {"$avg":"$Event_rank"}, 
            "averagescore": {"$avg":"$Event_score"},
            "bestrank": {"$min":"$Event_rank"},
            "worstrank": {"$max":"$Event_rank"},
            "minscore":{"$min":"$Event_score"},
            "maxscore":{"$max":"$Event_score"}
            },
        },
        { "$project": {
            "averagerank":"$averagerank",
            "averagescore" : "$averagescore",
            "bestrank" : "$bestrank",
            "worstrank" : "$worstrank",
            "minscore" : "$minscore",
            "maxscore" : "$maxscore"}
        }
    ]
    avgpercomp = db.event_data.aggregate(pipeline,allowDiskUse=True)
    avgcomplist = []
    for a in avgpercomp:
        avgcompentry = {}
        avgcompentry['Competitor Name'] = a['_id']
        avgcompentry['Rank Average'] = a['averagerank']
        avgcompentry['Score Average'] = a['averagescore']
        avgcompentry['Best Rank'] = a['bestrank']
        avgcompentry['Worst Rank'] = a['worstrank']
        avgcompentry['Lowest Score'] = a['minscore']
        avgcompentry['Highest Score'] = a['maxscore']
        avgcomplist.append(avgcompentry)
    return jsonify(avgcomplist)


@app.route("/api/v1.0/lookup/<gender>/<limit>")
def averagepergender(gender,limit):

    canonicalized = gender.replace(" ","").upper()
    avggender = db.athletes.aggregate([
        {"$match": {"gender":str(canonicalized)}},
        {
            "$lookup": {
                "from": "event_data",
                "localField": "Competitor_id",
                "foreignField": "Competitor_id",
                "as": "events"
            }
        },
        {   "$unwind": "$events"},
        {   "$limit":int(limit)},
        {
            "$project":{
                "Competitor_id": 1,
                "Competitor_name": 1,
                "Event_rank": "$events.Event_rank",
                "Event_score": "$events.Event_score",
                "gender": 1,
                "age":1,
                "height":1,
                "weight":1
            }
        }
    ])

    avggenderlist = []
    for avg in avggender:
        search_term = avg['gender'].replace(" ","").upper()
        if search_term == canonicalized:
            avggenentry = {}
            avggenentry['ID'] = avg['Competitor_id']
            avggenentry['Name'] = avg['Competitor_name']
            avggenentry['Rank'] = avg['Event_rank']
            avggenentry['Score'] = avg['Event_score']
            avggenentry['Gender'] = avg['gender']
            avggenentry['Age'] = avg['age']
            avggenentry['Height'] = avg['height']
            avggenentry['Weight'] = avg['weight']
            avggenderlist.append(avggenentry)
    return jsonify(avggenderlist)


@app.route("/api/v1.0/compinfo/<compname>")
def compinforselection(compname):
    # canonicalizedcomp = compname.replace(" ","").lower()
    compinfoselect = db.athletes.find({"Competitor_name":str(compname)})
    clist = []
    for c in compinfoselect:
        # search_termcomp = c['Competitor_name'].replace(" ","").lower()
        # if search_termcomp == canonicalizedcomp:
        comp = {}
        comp['Competitor Id'] = c['Competitor_id']
        comp['Competitor Name'] = c['Competitor_name']
        comp['First Name'] = c['first_name']
        comp['Last Name'] = c['last_name']
        comp['Status'] = c['status']
        comp['Gender'] = c['gender']
        comp['Region Name'] = c['region_name']
        comp['Affiliate ID'] = c['affiliate_id']
        comp['Affiliate Name'] = c['affiliate_name']
        comp['Age'] = c['age']
        comp['Height(in)'] = c['height']
        comp['Weight(lbs)'] = c['weight']
        clist.append(comp)
    return jsonify(clist)


@app.route("/api/v1.0/affiliates")
def affiliates():
    aff = db.affiliates.find()
    # print()
    aff_names = []
    for a in aff:
        affiliate = {}
        affiliate['Affiliate Name'] = a['Affiliate_name']
        affiliate['Address'] = a['Address']
        affiliate['City'] = a['City']
        affiliate['State'] = a['State']
        affiliate['Zip Code'] = a['Zip']
        affiliate['Country'] = a['Country']
        affiliate['Website'] = a['Website']
        affiliate['Lat'] = a['Latitude']
        affiliate['Lon'] = a['Longitude']
        aff_names.append(affiliate)
    return jsonify(aff_names)