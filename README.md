## Environment

1. AWS EC2 AMI: amzn-ami-hvm-2016.03.3.x86_64-gp2 (ami-374db956)
2. Node.JS Version: v6.4.0 
3. Docker Version: v1.11.2, build b9f10c9/1.11.2 (for MongoDB)
4. MongoDB Version: v2.6.11
5. PM2 Version: 1.1.3

## Quick start

1. `$ git clone git@github.com:levichen/simple-oauth.git your_app`
2. `$ cd your_app`
3. `$ npm install`
4. `$ mv config/config.js.template config/config.js`
5. `$ Configure config/config.js`
4. `$ pm2 pm2_start.json`

## Database Schema

The Schema in the models/user.js

## Time Spent
* 4 hours