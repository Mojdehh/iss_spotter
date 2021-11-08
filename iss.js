const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const ip = JSON.parse(body).ip;
    callback(error, ip);
    
  });

};


const fetchCoordsByIP = function(ip, callback) {
  
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const coodinates = {};
    coodinates["latitude"] = JSON.parse(body).latitude;
    coodinates["longitude"] = JSON.parse(body).longitude;
    callback(null, coodinates);

  });

};

const fetchISSFlyOverTimes = function(coords, callback) {

  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const passes = JSON.parse(body).response;
    callback(null, passes);

  });


};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchCoordsByIP(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses)
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };