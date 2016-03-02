var governors = {
  AL: ['Robert Bentley', 'Alabama', 'GovernorBentley'],
  AK: ['Bill Walker', 'Alaska', 'AkGovBillWalker'],
  AZ: ['Doug Ducey', 'Arizona', 'dougducey'],
  AR: ['Asa Hutchinson', 'Arkansas', 'AsaHutchinson'],
  CA: ['Jerry Brown', 'California', 'JerryBrownGov'],
  CO: ['John Hickenlooper', 'Colorado', 'hickforco'],
  CT: ['Dannel Malloy', 'Connecticut', 'GovMalloyOffice'],
  DE: ['Jack Markell', 'Delaware', 'GovernorMarkell'],
  FL: ['Rick Scott', 'Florida', 'FLGovScott'],
  GA: ['Nathan Deal', 'Georgia', 'GovernorDeal'],
  HI: ['David Ige', 'Hawaii', 'GovHawaii'],
  ID: ['Butch Otter', 'Idaho', 'ButchOtter'],
  IL: ['Bruce Rauner', 'Illinois', 'GovRauner'],
  IN: ['Mike Pence', 'Indiana', 'GovPenceIN'],
  IA: ['Terry Branstad', 'Iowa', 'Why'],
  KS: ['Sam Brownback', 'Kansas', 'govsambrownback'],
  KY: ['Matt Bevin', 'Kentucky', 'MattBevin'],
  LA: ['Bobby Jindal', 'Louisiana', 'BobbyJindal'],
  ME: ['Paul LePage', 'Maine', 'Governor_LePage'],
  MD: ['Larry Hogan', 'Maryland', 'LarryHogan'],
  MA: ['Charlie Baker', 'Massachusetts', 'MassGovernor'],
  MI: ['Rick Snyder', 'Michigan', 'onetoughnerd'],
  MN: ['Mark Dayton', 'Minnesota', 'GovMarkDayton'],
  MS: ['Phil Bryant', 'Mississippi', 'PhilBryantMS'],
  MO: ['Jay Nixon', 'Missouri', 'GovJayNixon'],
  MT: ['Steve Bullock', 'Montana', 'GovernorBullock'],
  NE: ['Pete Ricketts', 'Nebraska', 'GovRicketts'],
  NV: ['Brian Sandoval', 'Nevada', 'GovSandoval'],
  NH: ['Maggie Hassan', 'New Hampshire', 'GovernorHassan'],
  NJ: ['Chris Christie', 'New Jersey', 'ChrisChristie'],
  NM: ['Susana Martinez', 'New Mexico', 'Gov_Martinez'],
  NY: ['Andrew Cuomo', 'New York', 'NYGovCuomo'],
  NC: ['Pat McCrory', 'North Carolina', 'PatMcCroryNC'],
  ND: ['Jack Dalrymple', 'North Dakota', 'NDGovDalrymple'],
  OH: ['John Kasich', 'Ohio', 'JohnKasich'],
  OK: ['Mary Fallin', 'Oklahoma', 'GovMaryFallin'],
  OR: ['Kate Brown', 'Oregon', 'OregonGovBrown'],
  PA: ['Tom Wolf', 'Pennsylvania', 'WolfForPA'],
  RI: ['Gina Raimondo', 'Rhode Island', 'GinaRaimondo'],
  SC: ['Nikki Haley', 'South Carolina', 'nikkihaley'],
  SD: ['Dennis Daugaard', 'South Dakota', 'SDGovDaugaard'],
  TN: ['Bill Haslam', 'Tennessee', 'BillHaslam'],
  TX: ['Greg Abbott', 'Texas', 'GregAbbott_TX'],
  UT: ['Gary Herbert', 'Utah', 'GovHerbert'],
  VT: ['Peter Shumlin', 'Vermont', 'GovPeterShumlin'],
  VA: ['Terry McAuliffe', 'Virginia', 'GovernorVA'],
  WA: ['Jay Inslee', 'Washington', 'GovInslee'],
  WV: ['Earl Ray Tomblin', 'West Virginia', 'GovTomblin'],
  WI: ['Scott Walker', 'Wisconsin', 'GovWalker'],
  WY: ['Matt Mead', 'Wyoming', 'GovMattMead']
};

$(function() {
  var sunlight_api_key = '9cb19fa1e8f249218c646380cc44d28a',
      keyhole_api_key = 'c5da9b79ad028b51',
      keyhole_track = '7q09Ph',
      maxmind_api_key = 'm1kTlDfEzGs0';

  var keyhole_url = 'http://w11.keyhole.co/api/v1?url=1.1/get&access_token=' + keyhole_api_key + '&track=' + keyhole_track + '&type=timeline&range=90'

  var keyhole = $.get(keyhole_url, function(data) {
    var total_tweets = data['results']['twitter']['total_tweets'];
    console.log(total_tweets);
  }).fail(function() {
    console.log( "error" );
  });

  // Detect country
  var onGeoSuccess = function(location) {
    var country = location.country.iso_code,
        postal = location.postal.code,
        state = location.subdivisions[0].iso_code;

    if (country == 'US' && state != 'AZ' && state != 'HI') {
      var sunlight_url = 'https://congress.api.sunlightfoundation.com/legislators/locate?zip=' + postal + '&amp;apikey=' + sunlight_api_key;

      var sunlight = $.get(sunlight_url, function(data) {
        if (data['count'] > 0) {
          var twitter_id = '',
              tweet_url = '',
              tweet = '';

          if (state in governors) {
            tweet += '@' + governors[state][2] + ' ';
          }

          for (i = 0; i < data['results'].length; i++) {
            twitter_id = data['results'][i]['twitter_id'];
            tweet += '@' + twitter_id + ' ';
          }

          tweet = '.' + tweet + 'DST is outdated and harmful.';

          console.log(tweet);
          tweet_url = 'https://twitter.com/intent/tweet?text=' + encodeURI(tweet) + '&amp;url=https://stopdst.com&amp;hashtags=stopDST&amp;related=hello';

          $('html').html(tweet + ' <a target="_blank" href="' + tweet_url + '">Tweet</a>');
        }
      }).fail(function() {
        console.log( "error" );
      });
    } else {
      // Not in the US
    }
  };

  var onGeoError = function(error) {
    console.log("Error:\n\n" + JSON.stringify(error, undefined, 4));
  };

  geoip2.city(onGeoSuccess, onGeoError);
});
