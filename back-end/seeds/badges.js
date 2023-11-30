const {Badge} = require('../models/badge');

const badges = [
    {icon: "bronze_match_badge", count: 1, type: "Match"},
    {icon: "silver_match_badge", count: 5, type: "Match"},
    {icon: "gold_match_badge", count: 10, type: "Match"},
    {icon: "gold_session_badge", count: 10, type: "Session"},
    {icon: "gold_session_badge", count: 10, type: "Session"},
    {icon: "gold_session_badge", count: 10, type: "Session"},
]

Badge.insertMany(badges);