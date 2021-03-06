var opening_hours = require('./opening_hours.js');

var test = new opening_hours_test();

// used for sunrise, sunset … and PH,SH
// http://nominatim.openstreetmap.org/reverse?format=json&lat=49.5487429714954&lon=9.81602098644987&zoom=18&addressdetails=1
var nominatiomTestJSON = {"place_id":"44651229","licence":"Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright","osm_type":"way","osm_id":"36248375","lat":"49.5400039","lon":"9.7937133","display_name":"K 2847, Lauda-K\u00f6nigshofen, Main-Tauber-Kreis, Regierungsbezirk Stuttgart, Baden-W\u00fcrttemberg, Germany, European Union","address":{"road":"K 2847","city":"Lauda-K\u00f6nigshofen","county":"Main-Tauber-Kreis","state_district":"Regierungsbezirk Stuttgart","state":"Baden-W\u00fcrttemberg","country":"Germany","country_code":"de","continent":"European Union"}};

// http://nominatim.openstreetmap.org/reverse?format=json&lat=60.5487429714954&lon=9.81602098644987&zoom=18&addressdetails=1
var nominatiomTestJSON_sunrise_below_default = {"place_id":"71977948","licence":"Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright","osm_type":"way","osm_id":"118145917","lat":"60.5467949","lon":"9.8269589","display_name":"243, Ringerike, Buskerud, Norway","address":{"road":"243","county":"Ringerike","state":"Buskerud","country":"Norway","country_code":"no"}};

// http://nominatim.openstreetmap.org/reverse?format=json&lat=53.1208&lon=8.8780&zoom=18&addressdetails=1&accept-language=de
var nominatiomTestJSON_bremen = {"place_id":"39182271","licence":"Data \u00a9 OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright","osm_type":"way","osm_id":"28200369","lat":"53.1249048","lon":"8.8755814","display_name":"Am Lehester Deich, Lehesterdeich, Horn-Lehe, Stadtbezirk Bremen-Ost, Bremen, 28357, Deutschland, Europ\u00e4ischen Union","address":{"road":"Am Lehester Deich","neighbourhood":"Lehesterdeich","suburb":"Horn-Lehe","city_district":"Stadtbezirk Bremen-Ost","city":"Bremen","county":"Bremen","state":"Bremen","postcode":"28357","country":"Deutschland","country_code":"de","continent":"Europ\u00e4ischen Union"}};

test.addTest('Time intervals', [
		'10:00-12:00',
		'10:00-12:00,',
		'10:00-12:00;',
		'10:00-11:00,11:00-12:00',
		'10:00-11:00; 11:00-12:00',
		'10:00-14:00; 12:00-14:00 off',
		'10:00-12:00; 10:30-11:30',
		// 'week 01-13: 07:00-20:00; week 14-40: 06:30-21:00; week 41-52: 07:00-20:00'
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 10:00', '2012.10.01 12:00' ],
		[ '2012.10.02 10:00', '2012.10.02 12:00' ],
		[ '2012.10.03 10:00', '2012.10.03 12:00' ],
		[ '2012.10.04 10:00', '2012.10.04 12:00' ],
		[ '2012.10.05 10:00', '2012.10.05 12:00' ],
		[ '2012.10.06 10:00', '2012.10.06 12:00' ],
		[ '2012.10.07 10:00', '2012.10.07 12:00' ],
	], 1000 * 60 * 60 * 2 * 7, 0, true, {}, 'not last test');

test.addTest('Time intervals', [
		'24/7; Mo 15:00-16:00 off', // throws a warning, use next value which is equal.
		'open; Mo 15:00-16:00 off',
		'00:00-24:00; Mo 15:00-16:00 off',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 00:00', '2012.10.01 15:00' ],
		[ '2012.10.01 16:00', '2012.10.08 00:00' ],
	], 1000 * 60 * 60 * (24 * 6 + 23), 0, true, {}, 'not last test');

test.addTest('Open end', [
		'07:00+ open "visit there website to know if they did already close"', // specified comments should not be overridden
		'07:00+ unknown "visit there website to know if they did already close"', // will always interpreted as unknown
	], '2012.10.01 0:00', '2012.10.02 0:00', [
		[ '2012.10.01 07:00', '2012.10.02 00:00', true,  'visit there website to know if they did already close' ],
	], 0, 1000 * 60 * 60 * (24 - 7), true, {}, 'not last test');

test.addTest('Open end', [
		'17:00+',
		'17:00+; 15:00-16:00 off',
		'15:00-16:00 off; 17:00+',
	], '2012.10.01 0:00', '2012.10.02 0:00', [
		[ '2012.10.01 00:00', '2012.10.01 03:00', true, 'Specified as open end. Closing time was guessed.' ],
		[ '2012.10.01 17:00', '2012.10.02 00:00', true, 'Specified as open end. Closing time was guessed.' ],
	], 0, 1000 * 60 * 60 * (3 + 24 - 17), true, nominatiomTestJSON, 'not last test');

test.addTest('Open end', [
		'17:00+ closed',
		'17:00-19:00 closed',
	], '2012.10.01 0:00', '2012.10.02 0:00', [
	], 0, 0, true, {}, 'not last test');

test.addTest('Open end', [
		'07:00+,12:00-16:00; 16:00-24:00 closed "needed because of open end"',
	], '2012.10.01 0:00', '2012.10.02 0:00', [
		[ '2012.10.01 07:00', '2012.10.01 12:00', true,  'Specified as open end. Closing time was guessed.' ],
		[ '2012.10.01 12:00', '2012.10.01 16:00' ],
	], 1000 * 60 * 60 * 4, 1000 * 60 * 60 * 5, true, {}, 'not last test');

test.addTest('Variable times e.g. dawn, dusk', [
		'Mo dawn-dusk',
		'dawn-dusk',
	], '2012.10.01 0:00', '2012.10.02 0:00', [
		[ '2012.10.01 06:50', '2012.10.01 19:32' ],
	], 1000 * 60 * (60 * 12 + 10 + 32), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable times e.g. sunrise, sunset', [
		'Mo sunrise-sunset',
		'sunrise-sunset',
	], '2012.10.01 0:00', '2012.10.02 0:00', [
		[ '2012.10.01 07:22', '2012.10.01 19:00' ],
	], 1000 * 60 * (60 * 11 + 38), 0, false, nominatiomTestJSON);

test.addTest('Variable times e.g. sunrise, sunset without coordinates (→ constant times)', [
		'sunrise-sunset',
	], '2012.10.01 0:00', '2012.10.03 0:00', [
		[ '2012.10.01 06:00', '2012.10.01 18:00' ],
		[ '2012.10.02 06:00', '2012.10.02 18:00' ],
	], 1000 * 60 * 60 * 12 * 2, 0, true);

test.addTest('Variable times calculation without coordinates', [
		'(sunrise+01:02)-(sunset-00:30)',
	], '2012.10.01 0:00', '2012.10.03 0:00', [
		[ '2012.10.01 07:02', '2012.10.01 17:30' ],
		[ '2012.10.02 07:02', '2012.10.02 17:30' ],
	], 1000 * 60 * (60 * 10 + 28) * 2, 0, true, {}, 'not last test');

test.addTest('Variable times e.g. dawn, dusk without coordinates (→ constant times)', [
		'dawn-dusk',
		'(dawn+00:00)-dusk', // testing variable time calculation, should not change time
		'dawn-(dusk-00:00)',
		'(dawn+00:00)-(dusk-00:00)',
	], '2012.10.01 0:00', '2012.10.03 0:00', [
		[ '2012.10.01 05:30', '2012.10.01 18:30' ],
		[ '2012.10.02 05:30', '2012.10.02 18:30' ],
	], 1000 * 60 * 60 * 13 * 2, 0, true);

test.addTest('Variable times e.g. sunrise, sunset over a few days', [
		'sunrise-sunset', // If your timezone uses daylight saving times you will see a difference of around one hours between two days.
	], '2012.10.01 0:00', '2012.10.04 0:00', [
		[ '2012.10.01 07:22', '2012.10.01 19:00' ],
		[ '2012.10.02 07:23', '2012.10.02 18:58' ],
		[ '2012.10.03 07:25', '2012.10.03 18:56' ],
	], 1000 * 60 * ((60 * 11 + 38) + (60 * 11 + 37 - 2) + (60 * 11 + 35 - 4)), 0, false, nominatiomTestJSON);

test.addTest('Variable times calculation with coordinates', [
		'(sunrise+02:00)-sunset',
	], '2012.10.01 0:00', '2012.10.04 0:00', [
		[ '2012.10.01 09:22', '2012.10.01 19:00' ],
		[ '2012.10.02 09:23', '2012.10.02 18:58' ],
		[ '2012.10.03 09:25', '2012.10.03 18:56' ],
	], 1000 * 60 * ((60 * 11 + 38) + (60 * 11 + 37 - 2) + (60 * 11 + 35 - 4) - 60 * 2 * 3), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable times which moves over fix end time', [
		'sunrise-08:02',
	], '2013.01.26 0:00', '2013.02.03 0:00', [
		// [ '2013.01.26 08:03', '2013.01.26 08:02' ], // Ignored because it would be interpreted as time range spanning midnight
		// [ '2013.01.27 08:02', '2013.01.27 08:02' ], // which is probably not what you want.
		[ '2013.01.28 08:00', '2013.01.28 08:02' ],
		[ '2013.01.29 07:59', '2013.01.29 08:02' ],
		[ '2013.01.30 07:58', '2013.01.30 08:02' ],
		[ '2013.01.31 07:56', '2013.01.31 08:02' ],
		[ '2013.02.01 07:55', '2013.02.01 08:02' ],
		[ '2013.02.02 07:54', '2013.02.02 08:02' ],
	], 1000 * 60 * (6 * 2 + 1 + 2 + 4 + 5 + 6), 0, false, nominatiomTestJSON);

test.addTest('Variable times which moves over fix end time', [
		'sunrise-08:00',
	], '2013.01.26 0:00', '2013.02.03 0:00', [
		[ '2013.01.29 07:59', '2013.01.29 08:00' ],
		[ '2013.01.30 07:58', '2013.01.30 08:00' ],
		[ '2013.01.31 07:56', '2013.01.31 08:00' ],
		[ '2013.02.01 07:55', '2013.02.01 08:00' ],
		[ '2013.02.02 07:54', '2013.02.02 08:00' ],
	], 1000 * 60 * (1 + 2 + 4 + 5 + 6), 0, false, nominatiomTestJSON);

test.addTest('Variable times which moves over fix end time', [
		'sunrise-07:58',
	], '2013.01.26 0:00', '2013.02.03 0:00', [
		[ '2013.01.31 07:56', '2013.01.31 07:58' ],
		[ '2013.02.01 07:55', '2013.02.01 07:58' ],
		[ '2013.02.02 07:54', '2013.02.02 07:58' ],
	], 1000 * 60 * (2 + 3 + 4), 0, false, nominatiomTestJSON);

test.addTest('Variable times which moves over fix end time', [
		'sunrise-06:00',
	], '2013.01.26 0:00', '2013.02.03 0:00', [
	// Not open in range. Constant sunrise <= end time < from time
	], 0, 0, false, nominatiomTestJSON);

test.addTest('Variable times which moves over fix end time', [
		'sunrise-05:59', // end time < constant time < from time
	], '2013.01.26 0:00', '2013.01.28 0:00', [
	[ '2013.01.26 00:00', '2013.01.26 05:59' ],
	[ '2013.01.26 08:02', '2013.01.27 05:59' ],
	[ '2013.01.27 08:00', '2013.01.28 00:00' ],
	], 1000 * 60 * ((60 * 5 + 59) + (60 * 22 - 3) + (60 * 16)), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable times which moves over fix end time', [
		'sunrise-06:00', // from time < constant time <= end time
	], '2013.04.15 0:00', '2013.04.19 0:00', [
		[ '2013.04.18 05:57', '2013.04.18 06:00' ],
	], 1000 * 60 * 3, 0, false, nominatiomTestJSON_sunrise_below_default);

test.addTest('Variable times which moves over fix end time', [
		ignored('sunrise-05:59'), // from time < end time <= constant time
	], '2013.04.13 0:00', '2013.04.19 0:00', [
		[ 'something else', '' ],
	], 1000 * 60 * 3, 0, false, nominatiomTestJSON_sunrise_below_default, 'not last test');

test.addTest('Variable times spanning midnight', [
		'sunset-sunrise',
		'sunset-sunrise Mo-Su',
	], '2012.10.01 0:00', '2012.10.03 0:00', [
		[ '2012.10.01 00:00', '2012.10.01 07:22' ],
		[ '2012.10.01 19:00', '2012.10.02 07:23' ],
		[ '2012.10.02 18:58', '2012.10.03 00:00' ],
	], 1000 * 60 * ((60 * 7 + 22) + (60 * (5 + 7) + 23) + (60 * 5 + 2)), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable days: public holidays', [
		'PH',
	], '2013.01.01 0:00', '2015.01.01 0:00', [
		[ '2013.01.01 00:00', '2013.01.02 00:00', false, 'Neujahrstag' ],
		[ '2013.01.06 00:00', '2013.01.07 00:00', false, 'Heilige Drei Könige' ],
		[ '2013.03.29 00:00', '2013.03.30 00:00', false, 'Karfreitag' ],
		[ '2013.04.01 00:00', '2013.04.02 00:00', false, 'Ostermontag' ],
		[ '2013.05.01 00:00', '2013.05.02 00:00', false, 'Tag der Arbeit' ],
		[ '2013.05.09 00:00', '2013.05.10 00:00', false, 'Christi Himmelfahrt' ],
		[ '2013.05.20 00:00', '2013.05.21 00:00', false, 'Pfingstmontag' ],
		[ '2013.05.30 00:00', '2013.05.31 00:00', false, 'Fronleichnam' ],
		[ '2013.10.03 00:00', '2013.10.04 00:00', false, 'Tag der Deutschen Einheit' ],
		[ '2013.11.01 00:00', '2013.11.02 00:00', false, 'Allerheiligen' ],
		[ '2013.12.25 00:00', '2013.12.26 00:00', false, '1. Weihnachtstag' ],
		[ '2013.12.26 00:00', '2013.12.27 00:00', false, '2. Weihnachtstag' ],
		[ '2014.01.01 00:00', '2014.01.02 00:00', false, 'Neujahrstag' ],
		[ '2014.01.06 00:00', '2014.01.07 00:00', false, 'Heilige Drei Könige' ],
		[ '2014.04.18 00:00', '2014.04.19 00:00', false, 'Karfreitag' ],
		[ '2014.04.21 00:00', '2014.04.22 00:00', false, 'Ostermontag' ],
		[ '2014.05.01 00:00', '2014.05.02 00:00', false, 'Tag der Arbeit' ],
		[ '2014.05.29 00:00', '2014.05.30 00:00', false, 'Christi Himmelfahrt' ],
		[ '2014.06.09 00:00', '2014.06.10 00:00', false, 'Pfingstmontag' ],
		[ '2014.06.19 00:00', '2014.06.20 00:00', false, 'Fronleichnam' ],
		[ '2014.10.03 00:00', '2014.10.04 00:00', false, 'Tag der Deutschen Einheit' ],
		[ '2014.11.01 00:00', '2014.11.02 00:00', false, 'Allerheiligen' ],
		[ '2014.12.25 00:00', '2014.12.26 00:00', false, '1. Weihnachtstag' ],
		[ '2014.12.26 00:00', '2014.12.27 00:00', false, '2. Weihnachtstag' ],
	], 1000 * 60 * 60 * 24 * (20 + 2 * 2), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable days: public holidays', [
		'open; PH off',
		// 'PH off; 24/7', // should not be the same if following the rules
	], '2013.04.01 0:00', '2013.05.11 0:00', [
		[ '2013.04.02 00:00', '2013.05.01 00:00' ],
		[ '2013.05.02 00:00', '2013.05.09 00:00' ],
		[ '2013.05.10 00:00', '2013.05.11 00:00' ],
	], 1000 * 60 * 60 * 24 * (30 - 1 + 7 + 1), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable days: public holidays (with time range)', [
		'PH 12:00-13:00',
	], '2012.01.01 0:00', '2012.04.01 0:00', [
		[ '2012.01.01 12:00', '2012.01.01 13:00', false, 'Neujahrstag' ],
		[ '2012.01.06 12:00', '2012.01.06 13:00', false, 'Heilige Drei Könige' ],
	], 1000 * 60 * 60 * 2, 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable days: public holidays (with time range)', [
		'PH 12:00-13:00 open "this comment should override the holiday name which is returned as comment if PH matches."',
	], '2012.01.01 0:00', '2012.04.01 0:00', [
		[ '2012.01.01 12:00', '2012.01.01 13:00', false, 'this comment should override the holiday name which is returned as comment if PH matches.' ],
		[ '2012.01.06 12:00', '2012.01.06 13:00', false, 'this comment should override the holiday name which is returned as comment if PH matches.' ],
	], 1000 * 60 * 60 * 2, 0, false, nominatiomTestJSON, 'not last test');

test.addTest('PH: Only if PH is Wednesday', [
		'PH We,Fr',
		'PH: We,Fr',
	], '2012.01.01 0:00', '2012.10.08 0:00', [
		[ '2012.01.06 00:00', '2012.01.07 00:00', false, 'Heilige Drei Könige' ],       // Fr
		[ '2012.04.06 00:00', '2012.04.07 00:00', false, 'Karfreitag' ],                // Fr
		[ '2012.10.03 00:00', '2012.10.04 00:00', false, 'Tag der Deutschen Einheit' ], // We
	], 1000 * 60 * 60 * 24 * 3, 0, false, nominatiomTestJSON, 'not only test');

test.addTest('PH: Only if SH is Wednesday', [
		'SH Mo-Fr',
		'SH: Mo-Fr',
	], '2012.12.22 0:00', '2013.01.08 0:00', [
		[ '2012.12.24 00:00', '2012.12.29 00:00', false, 'Weihnachtsferien' ],
		[ '2012.12.31 00:00', '2013.01.05 00:00', false, 'Weihnachtsferien' ],
	], 1000 * 60 * 60 * 24 * (5 * 2), 0, false, nominatiomTestJSON, 'not only test');

test.addTest('Variable days: public holidays', [
		'PH +1 day',
	], '2014.10.22 0:00', '2015.01.15 0:00', [
		[ '2014.11.02 00:00', '2014.11.03 00:00', false, 'Day after Allerheiligen' ],
		[ '2014.12.26 00:00', '2014.12.27 00:00', false, 'Day after 1. Weihnachtstag' ],
		[ '2014.12.27 00:00', '2014.12.28 00:00', false, 'Day after 2. Weihnachtstag' ],
		[ '2015.01.02 00:00', '2015.01.03 00:00', false, 'Day after Neujahrstag' ],
		[ '2015.01.07 00:00', '2015.01.08 00:00', false, 'Day after Heilige Drei Könige' ],
	], 1000 * 60 * 60 * 24 * (3 + 2), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable days: public holidays', [
		'PH -1 day',
	], '2014.10.25 0:00', '2015.01.15 0:00', [
		// [ '2014.11.01 00:00', '2014.11.02 00:00' ],
		// [ '2014.12.25 00:00', '2014.12.27 00:00' ],
		[ '2014.10.31 00:00', '2014.11.01 00:00', false, 'Day before Allerheiligen' ],
		[ '2014.12.24 00:00', '2014.12.25 00:00', false, 'Day before 1. Weihnachtstag' ],
		[ '2014.12.25 00:00', '2014.12.26 00:00', false, 'Day before 2. Weihnachtstag' ],
		[ '2014.12.31 00:00', '2015.01.01 00:00', false, 'Day before Neujahrstag' ],
		[ '2015.01.05 00:00', '2015.01.06 00:00', false, 'Day before Heilige Drei Könige' ],
	], 1000 * 60 * 60 * 24 * (3 + 2), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable days: school holidays', [
		'SH',
	], '2014.01.01 0:00', '2015.02.01 0:00', [
		[ '2014.01.01 00:00', '2014.01.05 00:00', false, 'Weihnachtsferien' ],
		[ '2014.04.14 00:00', '2014.04.26 00:00', false, 'Osterferien' ],
		[ '2014.06.10 00:00', '2014.06.22 00:00', false, 'Pfingstferien' ],
		[ '2014.07.31 00:00', '2014.09.14 00:00', false, 'Sommerferien' ],
		[ '2014.10.27 00:00', '2014.10.31 00:00', false, 'Herbstferien' ],
		[ '2014.12.22 00:00', '2015.01.06 00:00', false, 'Weihnachtsferien' ],
	], 1000 * 60 * 60 * 24 * (4 + 12 + 12 + 1 + 31 + 13 + 4 + 15), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable days: school holiday', [
		'open; SH off',
	], '2014.01.01 0:00', '2014.06.15 0:00', [
		[ '2014.01.05 00:00', '2014.04.14 00:00' ],
		[ '2014.04.26 00:00', '2014.06.10 00:00' ],
	], 1000 * 60 * 60 * 24 * (31 - 5 + 28 + 31 + 14 + 4 + 31 + 10) -(/* daylight saving time CEST */ 1000 * 60 * 60), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable days: school holidays', [
		'SH',
	], '2014.01.01 0:00', '2015.01.10 0:00', [
		[ '2014.01.01 00:00', '2014.01.04 00:00', false, 'Weihnachtsferien' ], // 3
		[ '2014.01.30 00:00', '2014.02.01 00:00', false, 'Winterferien' ],     // 2
		[ '2014.04.03 00:00', '2014.04.23 00:00', false, 'Osterferien' ],      // 20
		[ '2014.05.02 00:00', '2014.05.03 00:00', false, 'Osterferien' ],      // 1
		[ '2014.05.30 00:00', '2014.05.31 00:00', false, 'Pfingstferien' ],    // 1
		[ '2014.06.10 00:00', '2014.06.11 00:00', false, 'Pfingstferien' ],    // 1
		[ '2014.07.31 00:00', '2014.09.11 00:00', false, 'Sommerferien' ],     // 1 + 31 + 10
		[ '2014.10.27 00:00', '2014.11.09 00:00', false, 'Herbstferien' ],     // 5 + 8
		[ '2014.12.22 00:00', '2015.01.06 00:00', false, 'Weihnachtsferien' ], // 10 + 5
	], 1000 * 60 * 60 * 24 * (3 + 2 + 20 + 1 + 1 + 1 + (1 + 31 + 10) + (5 + 8) + (10 + 5)), 0, false, nominatiomTestJSON_bremen, 'not last test');

test.addTest('SH: Only if SH is Wednesday', [
		'SH We',
	], '2014.01.01 0:00', '2014.05.10 0:00', [
		[ '2014.01.01 00:00', '2014.01.02 00:00', false, 'Weihnachtsferien' ],
		[ '2014.04.16 00:00', '2014.04.17 00:00', false, 'Osterferien' ],
		[ '2014.04.23 00:00', '2014.04.24 00:00', false, 'Osterferien' ],
	], 1000 * 60 * 60 * 24 * 3, 0, false, nominatiomTestJSON, 'not only test');

test.addTest('Variable days: school holidays', [
		'SH,PH',
		// 'PH,SH', // Note that later holidays override the comment for the first holidays.
	], '2014.01.01 0:00', '2014.02.15 0:00', [
		[ '2014.01.01 00:00', '2014.01.02 00:00', false, 'Neujahrstag' ],
		[ '2014.01.02 00:00', '2014.01.05 00:00', false, 'Weihnachtsferien' ],
		[ '2014.01.06 00:00', '2014.01.07 00:00', false, 'Heilige Drei Könige' ],
	], 1000 * 60 * 60 * 24 * (4 + 1), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable days: school holidays', [
		'Su,SH,PH',
		'SH,Su,PH',
		'SH,PH,Su',
	], '2014.01.01 0:00', '2014.02.15 0:00', [
		[ '2014.01.01 00:00', '2014.01.02 00:00', false, 'Neujahrstag' ],
		[ '2014.01.02 00:00', '2014.01.05 00:00', false, 'Weihnachtsferien' ],
		[ '2014.01.05 00:00', '2014.01.06 00:00' ],
		[ '2014.01.06 00:00', '2014.01.07 00:00', false, 'Heilige Drei Könige' ],
		[ '2014.01.12 00:00', '2014.01.13 00:00' ],
		[ '2014.01.19 00:00', '2014.01.20 00:00' ],
		[ '2014.01.26 00:00', '2014.01.27 00:00' ],
		[ '2014.02.02 00:00', '2014.02.03 00:00' ],
		[ '2014.02.09 00:00', '2014.02.10 00:00' ],
	], 1000 * 60 * 60 * 24 * (4 + 1 + 6), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Variable times spanning midnight', [
		'sunset-sunrise',
		'sunset-sunrise Mo-Su',
		// '19:00-07:22 Mo-Su', // also works but is week stable
		'sunset-07:22 Mo-Su',
		'19:00-sunrise Mo-Su',
	], '2012.10.01 0:00', '2012.10.02 0:00', [
		[ '2012.10.01 00:00', '2012.10.01 07:22' ],
		[ '2012.10.01 19:00', '2012.10.02 00:00' ],
	], 1000 * 60 * ((60 * 7 + 22) + (60 * 5)), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Time ranges spanning midnight', [
		'22:00-02:00',
		'22:00-26:00',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 00:00', '2012.10.01 02:00' ],
		[ '2012.10.01 22:00', '2012.10.02 02:00' ],
		[ '2012.10.02 22:00', '2012.10.03 02:00' ],
		[ '2012.10.03 22:00', '2012.10.04 02:00' ],
		[ '2012.10.04 22:00', '2012.10.05 02:00' ],
		[ '2012.10.05 22:00', '2012.10.06 02:00' ],
		[ '2012.10.06 22:00', '2012.10.07 02:00' ],
		[ '2012.10.07 22:00', '2012.10.08 00:00' ],
	], 1000 * 60 * 60 * 4 * 7, 0, true, nominatiomTestJSON);

test.addTest('Time ranges spanning midnight', [
		'We 22:00-22:00',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.03 22:00', '2012.10.04 22:00' ],
	], 1000 * 60 * 60 * 24, 0, true, {}, 'not last test');

test.addTest('Time ranges spanning midnight with date overwriting', [
		'22:00-02:00; Tu 12:00-14:00',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
	[ '2012.10.01 00:00', '2012.10.01 02:00' ],
	[ '2012.10.01 22:00', '2012.10.02 00:00' ],
	[ '2012.10.02 12:00', '2012.10.02 14:00' ],
	[ '2012.10.03 00:00', '2012.10.03 02:00' ],
	[ '2012.10.03 22:00', '2012.10.04 02:00' ],
	[ '2012.10.04 22:00', '2012.10.05 02:00' ],
	[ '2012.10.05 22:00', '2012.10.06 02:00' ],
	[ '2012.10.06 22:00', '2012.10.07 02:00' ],
	[ '2012.10.07 22:00', '2012.10.08 00:00' ],
	], 1000 * 60 * 60 * (6 * 4 + 2), 0, true, {}, 'not last test');

test.addTest('Time ranges spanning midnight with date overwriting (complex real world)', [
		'Su-Tu 11:00-01:00, We-Th 11:00-03:00, Fr 11:00-06:00, Sa 11:00-07:00',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 00:00', '2012.10.01 01:00', ], // Mo: Su-Tu 11:00-01:00
		[ '2012.10.01 11:00', '2012.10.02 01:00', ], // Mo: Su-Tu 11:00-01:00
		[ '2012.10.02 11:00', '2012.10.03 01:00', ], // Tu: Su-Tu 11:00-01:00
		[ '2012.10.03 11:00', '2012.10.04 03:00', ], // We: We-Th 11:00-03:00
		[ '2012.10.04 11:00', '2012.10.05 03:00', ], // Th: We-Th 11:00-03:00
		[ '2012.10.05 11:00', '2012.10.06 06:00', ], // Fr: Fr 11:00-06:00
		[ '2012.10.06 11:00', '2012.10.07 07:00', ], // Sa: Sa 11:00-07:00
		[ '2012.10.07 11:00', '2012.10.08 00:00', ], // Su: Su-Tu 11:00-01:00
	], 1000 * 60 * 60 * (1 + 14 * 2 + 16 * 2 + 19 + 20 + 13), 0, true);

test.addTest('Constrained weekday (complex real world example)', [
		'Apr-Oct: Su[2] 14:00-18:00; Aug Su[-1] -1 day 10:00-18:00, Aug Su[-1]: 10:00-18:00',
		'Apr-Oct: Su[2] 14:00-18:00; Aug Su[-1] -1 day 10:00-18:00; Aug Su[-1]: 10:00-18:00', // better use this instead
	], '2013.08.01 0:00', '2013.10.08 0:00', [
		[ '2013.08.11 14:00', '2013.08.11 18:00' ],
		[ '2013.08.24 10:00', '2013.08.24 18:00' ],
		[ '2013.08.25 10:00', '2013.08.25 18:00' ],
		[ '2013.09.08 14:00', '2013.09.08 18:00' ],
	], 1000 * 60 * 60 * (4 * 2 + 4 * 4), 0, false, {}, 'not last test');

test.addTest('Weekdays', [
		'Mo,Th,Sa,Su 10:00-12:00',
		'Mo,Th,Sa-Su 10:00-12:00',
		'Th,Sa-Mo 10:00-12:00',
		'10:00-12:00; Tu-We 00:00-24:00 off; Fr 00:00-24:00 off',
		'10:00-12:00; Tu-We off; Fr off',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 10:00', '2012.10.01 12:00' ],
		[ '2012.10.04 10:00', '2012.10.04 12:00' ],
		[ '2012.10.06 10:00', '2012.10.06 12:00' ],
		[ '2012.10.07 10:00', '2012.10.07 12:00' ],
	], 1000 * 60 * 60 * 2 * 4, 0, true);

test.addTest('Omitted time', [
		'Mo,We',
		'Mo&We', // error tolerance
		'Mo and We', // error tolerance
		'Mo-We; Tu off',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 0:00', '2012.10.02 0:00' ],
		[ '2012.10.03 0:00', '2012.10.04 0:00' ],
	], 1000 * 60 * 60 * 24 * 2, 0, true, {}, 'not last test');

test.addTest('Time ranges spanning midnight w/weekdays', [
		'We 22:00-02:00',
		'We 22:00-26:00',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.03 22:00', '2012.10.04 02:00' ],
	], 1000 * 60 * 60 * 4, 0, true);

test.addTest('Full range', [
		'00:00-24:00',
		'Mo-Su 00:00-24:00',
		'Tu-Mo 00:00-24:00',
		'We-Tu 00:00-24:00',
		'Th-We 00:00-24:00',
		'Fr-Th 00:00-24:00',
		'Sa-Fr 00:00-24:00',
		'Su-Sa 00:00-24:00',
		'24/7',
		'24/7; 24/7',
		'open',
		'12:00-13:00; 24/7',
		'Mo-Fr,Sa,Su',
		ignored('PH,Mo-Fr,Sa,Su', 'check for week stable not implemented'),
		ignored('PH,Mo-Fr,Sa,Su,SH', 'check for week stable not implemented'),
		ignored('Mo-Fr,Sa,PH,Su,SH', 'check for week stable not implemented'),
		// week stable actually, but check for that needs extra logic
		'Jan-Dec',
		'Feb-Jan',
		'Dec-Nov',
		ignored('Jan 01-Dec 31', 'check for week stable not implemented'),
		ignored('week 1-54', 'check for week stable not implemented'),
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 0:00', '2012.10.08 0:00' ],
	], 1000 * 60 * 60 * 24 * 7, 0, true, nominatiomTestJSON, 'not only test');

// Not sure if this was intended, but this is how the code handles it.
// And it is not bad actually.
test.addTest('Interpetation of points im time', [
		ignored('12:00'),
		ignored('Mo-Fr 12:00'),
	], '2012.10.01 0:00', '2012.10.04 0:00', [
		[ '2012.10.01 12:00', '2012.10.01 12:01' ],
		[ '2012.10.02 12:00', '2012.10.02 12:01' ],
		[ '2012.10.03 12:00', '2012.10.03 12:01' ],
	], 1000 * 60 * 3, 0, true, {}, 'not last test');

test.addTest('24/7 as time interval alias (don’t use it 24/7 as showen here)', [
		'Mo,We 24/7', // throws a warning, use one of the next values instead
		'Mo,We open',
		'Mo,We',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 0:00', '2012.10.02 0:00' ],
		[ '2012.10.03 0:00', '2012.10.04 0:00' ],
	], 1000 * 60 * 60 * 24 * 2, 0, true);

test.addTest('Constrained weekdays', [
		'We[4,5] 10:00-12:00',
		'We[4-5] 10:00-12:00',
		'We[4],We[5] 10:00-12:00',
		'We[4] 10:00-12:00; We[-1] 10:00-12:00',
		'We[-1,-2] 10:00-12:00',
	], '2012.10.01 0:00', '2012.11.01 0:00', [
		[ '2012.10.24 10:00', '2012.10.24 12:00' ],
		[ '2012.10.31 10:00', '2012.10.31 12:00' ],
	], 1000 * 60 * 60 * 2 * 2, 0, false);

test.addTest('Calculations based on constrained weekdays', [
		'Sa[-1] +3 days 10:00-12:00',
		'Sa[-1] +3 day 10:00-12:00', // 3 day is bad English but our library does tread them as synonym
	], '2013.08.21 0:00', '2014.02.01 0:00', [
		[ '2013.09.01 10:00', '2013.09.01 12:00' ],
		[ '2013.10.01 10:00', '2013.10.01 12:00' ],
		[ '2013.10.29 10:00', '2013.10.29 12:00' ],
		[ '2013.12.03 10:00', '2013.12.03 12:00' ],
		[ '2013.12.31 10:00', '2013.12.31 12:00' ],
		[ '2014.01.28 10:00', '2014.01.28 12:00' ],
	], 1000 * 60 * 60 * 2 * 6, 0, false, {}, 'not last test');

test.addTest('Calculations based on constrained weekdays: last weekend in month', [
		'Sa[-1],Sa[-1] +1 day 10:00-12:00',
	], '2013.08.21 0:00', '2013.10.03 0:00', [
		[ '2013.08.31 10:00', '2013.08.31 12:00' ],
		[ '2013.09.01 10:00', '2013.09.01 12:00' ],
		[ '2013.09.28 10:00', '2013.09.28 12:00' ],
		[ '2013.09.29 10:00', '2013.09.29 12:00' ],
	], 1000 * 60 * 60 * 2 * 4, 0, false, {}, 'not last test');

test.addTest('Calculations based on constrained weekdays: last weekend in month', [
		'Sa[-1],Sa[-1] +1 day',
	], '2013.08.21 0:00', '2013.10.03 0:00', [
		[ '2013.08.31 00:00', '2013.09.02 00:00' ],
		[ '2013.09.28 00:00', '2013.09.30 00:00' ],
	], 1000 * 60 * 60 * 24 * 4, 0, false, {}, 'not last test');

test.addTest('Calculations based on constrained weekdays', [
		'Sa[2] +3 days 10:00-12:00',
	], '2013.08.21 0:00', '2013.12.01 0:00', [
	[ '2013.09.17 10:00', '2013.09.17 12:00' ],
	[ '2013.10.15 10:00', '2013.10.15 12:00' ],
	[ '2013.11.12 10:00', '2013.11.12 12:00' ],
	], 1000 * 60 * 60 * 2 * 3, 0, false, {}, 'not last test');

test.addTest('Calculations based on constrained weekdays', [
		'Sa[1] -5 days',
	], '2013.08.21 0:00', '2014.02.01 0:00', [
		[ '2013.09.02 00:00', '2013.09.03 00:00' ],
		[ '2013.09.30 00:00', '2013.10.01 00:00' ],
		[ '2013.10.28 00:00', '2013.10.29 00:00' ],
		[ '2013.12.02 00:00', '2013.12.03 00:00' ],
		[ '2013.12.30 00:00', '2013.12.31 00:00' ],
		[ '2014.01.27 00:00', '2014.01.28 00:00' ],
	], 1000 * 60 * 60 * 24 * 6, 0, false, {}, 'not last test');

test.addTest('Calculations based on constrained weekdays', [
		'Su[-1] -1 day',
	], '2013.08.21 0:00', '2014.02.01 0:00', [
		[ '2013.08.24 00:00', '2013.08.25 00:00' ],
		[ '2013.09.28 00:00', '2013.09.29 00:00' ],
		[ '2013.10.26 00:00', '2013.10.27 00:00' ],
		[ '2013.11.23 00:00', '2013.11.24 00:00' ],
		[ '2013.12.28 00:00', '2013.12.29 00:00' ],
		[ '2014.01.25 00:00', '2014.01.26 00:00' ],
	], 1000 * 60 * 60 * 24 * 6, 0, false, {}, 'not last test');

test.addTest('Constrained weekday', [
		'Aug Su[-1] +1 day',
	], '2013.08.28 0:00', '2013.10.08 0:00', [
	], 0, 0, false, {}, 'not last test');

test.addTest('Constrained weekday', [
		'Aug Su[-1] +1 day',
	], '2013.08.29 0:00', '2013.10.08 0:00', [ // Error in selector code for this date. Only when starting at this date.
	], 0, 0, false, {}, 'not last test');

test.addTest('Exception blocks', [
		'Mo-Fr 10:00-16:00; We 12:00-18:00'
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 10:00', '2012.10.01 16:00' ],
		[ '2012.10.02 10:00', '2012.10.02 16:00' ],
		[ '2012.10.03 12:00', '2012.10.03 18:00' ], // Not 10:00-18:00
		[ '2012.10.04 10:00', '2012.10.04 16:00' ],
		[ '2012.10.05 10:00', '2012.10.05 16:00' ],
	], 1000 * 60 * 60 * 6 * 5, 0, true);

test.addTest('Additional blocks', [
		'Mo-Fr 10:00-16:00, We 12:00-18:00',
		'Mo-Fr 10:00-16:00, We 12:00-18:00,',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 10:00', '2012.10.01 16:00' ],
		[ '2012.10.02 10:00', '2012.10.02 16:00' ],
		[ '2012.10.03 10:00', '2012.10.03 18:00' ],
		[ '2012.10.04 10:00', '2012.10.04 16:00' ],
		[ '2012.10.05 10:00', '2012.10.05 16:00' ],
	], 1000 * 60 * 60 * (6 * 5 + 2), 0, true, {}, 'not last test');

test.addTest('Additional blocks', [
		'Mo-Fr 08:00-12:00, We 14:00-18:00',
		'Mo-Fr 08:00-12:00, We 14:00-18:00, Su off',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 08:00', '2012.10.01 12:00' ],
		[ '2012.10.02 08:00', '2012.10.02 12:00' ],
		[ '2012.10.03 08:00', '2012.10.03 12:00' ],
		[ '2012.10.03 14:00', '2012.10.03 18:00' ],
		[ '2012.10.04 08:00', '2012.10.04 12:00' ],
		[ '2012.10.05 08:00', '2012.10.05 12:00' ],
	], 1000 * 60 * 60 * (5 * 4 + 4), 0, true, {}, 'not last test');

test.addTest('Fallback group blocks (unknown)', [
		'We-Fr 10:00-24:00 open "it is open" || "please call"',
		'We-Fr 10:00-24:00 open "it is open" || "please call" || closed "should never appear"',
		'We-Fr 10:00-24:00 open "it is open" || "please call" || unknown "should never appear"',
		'We-Fr 10:00-24:00 open "it is open" || "please call" || open "should never appear"',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 00:00', '2012.10.03 10:00', true,  'please call' ],
		[ '2012.10.03 10:00', '2012.10.04 00:00', false, 'it is open' ],
		[ '2012.10.04 00:00', '2012.10.04 10:00', true,  'please call' ],
		[ '2012.10.04 10:00', '2012.10.05 00:00', false, 'it is open' ],
		[ '2012.10.05 00:00', '2012.10.05 10:00', true,  'please call' ],
		[ '2012.10.05 10:00', '2012.10.06 00:00', false, 'it is open' ],
		[ '2012.10.06 00:00', '2012.10.08 00:00', true,  'please call' ],
	], 1000 * 60 * 60 * 14 * 3, 1000 * 60 * 60 * (10 * 3 + 24 * (2 + 2)), true, {}, 'not last test');

test.addTest('Fallback group blocks', [
		'We-Fr 10:00-24:00 open "first" || We "please call" || open "we are open!!!"',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 00:00', '2012.10.03 00:00', false, 'we are open!!!' ], // Mo,Tu
		[ '2012.10.03 00:00', '2012.10.03 10:00', true,  'please call' ],    // We
		[ '2012.10.03 10:00', '2012.10.04 00:00', false, 'first' ],          // We
		[ '2012.10.04 00:00', '2012.10.04 10:00', false, 'we are open!!!' ], // Th
		[ '2012.10.04 10:00', '2012.10.05 00:00', false, 'first' ],          // Th
		[ '2012.10.05 00:00', '2012.10.05 10:00', false, 'we are open!!!' ], // Fr
		[ '2012.10.05 10:00', '2012.10.06 00:00', false, 'first' ],          // Fr
		[ '2012.10.06 00:00', '2012.10.08 00:00', false, 'we are open!!!' ], // Sa,Su
	], 1000 * 60 * 60 * (24 * 2 * 2 + 14 * 3 + 10 * 2), 1000 * 60 * 60 * 10, true, {}, 'not last test');

// example from Netzwolf: http://www.netzwolf.info/kartografie/osm/time_domain/erklaerung
test.addTest('Fallback group blocks', [
		'Mo-Fr 08:00-12:00,14:00-18:00, Sa 09:00-13:00, PH off || Tu 06:00-06:00 open "Notdienst"',
	], '2013.10.01 0:00', '2013.10.08 0:00', [
		[ '2013.10.01 06:00', '2013.10.01 08:00', false, 'Notdienst' ], // Tu
		[ '2013.10.01 08:00', '2013.10.01 12:00' ],
		[ '2013.10.01 12:00', '2013.10.01 14:00', false, 'Notdienst' ],
		[ '2013.10.01 14:00', '2013.10.01 18:00' ],
		[ '2013.10.01 18:00', '2013.10.02 06:00', false, 'Notdienst' ],
		[ '2013.10.02 08:00', '2013.10.02 12:00' ], // We
		[ '2013.10.02 14:00', '2013.10.02 18:00' ],
		[ '2013.10.04 08:00', '2013.10.04 12:00' ],
		[ '2013.10.04 14:00', '2013.10.04 18:00' ],
		[ '2013.10.05 09:00', '2013.10.05 13:00' ], // Sa
		[ '2013.10.07 08:00', '2013.10.07 12:00' ], // Mo
		[ '2013.10.07 14:00', '2013.10.07 18:00' ],
	], 1000 * 60 * 60 * ((4 * 8 + 4) + (2 + 2 + (6 + 6))), 0, false, nominatiomTestJSON, 'not last test');

// example from Netzwolf: http://www.netzwolf.info/en/cartography/osm/time_domain/form_hours
test.addTest('Fallback group blocks', [
		'Mo-Fr 08:00-11:00 || Th-Sa 12:00-13:00 open "Emergency only"',
		'Mo-Fr 08:00-11:00, Th-Sa 12:00-13:00 open "Emergency only"',
		// additional block does the same in this case because the second block does not overlap the first block.
	], '2013.10.01 0:00', '2013.10.08 0:00', [
		[ '2013.10.01 08:00', '2013.10.01 11:00' ],
		[ '2013.10.02 08:00', '2013.10.02 11:00' ],
		[ '2013.10.03 08:00', '2013.10.03 11:00' ],
		[ '2013.10.03 12:00', '2013.10.03 13:00', false, 'Emergency only' ],
		[ '2013.10.04 08:00', '2013.10.04 11:00' ],
		[ '2013.10.04 12:00', '2013.10.04 13:00', false, 'Emergency only' ],
		[ '2013.10.05 12:00', '2013.10.05 13:00', false, 'Emergency only' ],
		[ '2013.10.07 08:00', '2013.10.07 11:00' ],
	], 1000 * 60 * 60 * (3 * 5 + 3 * 1), 0, true, nominatiomTestJSON, 'not last test');

test.addTest('Month ranges', [
		'Nov-Feb 00:00-24:00',
		'Nov-Feb: 00:00-24:00',
		'Jan,Feb,Nov,Dec 00:00-24:00',
		'00:00-24:00; Mar-Oct off',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.01 00:00', '2012.03.01 00:00' ],
		[ '2012.11.01 00:00', '2013.01.01 00:00' ],
	], 1000 * 60 * 60 * 24 * (31 + 29 + 30 + 31), 0, false);

test.addTest('Month ranges', [
		'Nov-Nov 00:00-24:00',
		'Nov-Nov',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.11.01 00:00', '2012.12.01 00:00' ],
	], 1000 * 60 * 60 * 24 * 30, 0, false, {}, 'not last test');

test.addTest('Month ranges', [
		'Jan 1,Dec 24-25; Nov Th[4]',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.01 00:00', '2012.01.02 00:00' ],
		[ '2012.11.22 00:00', '2012.11.23 00:00' ],
		[ '2012.12.24 00:00', '2012.12.26 00:00' ],
	], 1000 * 60 * 60 * 24 * 4, 0, false, {}, 'not last test');

test.addTest('Week ranges', [
		'week 1,3 00:00-24:00',
		'week 1,3 00:00-24:00 || closed "should not change the test result"', // because comments for closed are not compared
		'week 1,3: 00:00-24:00',
		'week 1-3/2 00:00-24:00',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.01 00:00', '2012.01.02 00:00' ],
		[ '2012.01.09 00:00', '2012.01.16 00:00' ],
	], 1000 * 60 * 60 * 24 * (1 + 7), 0, false);

test.addTest('Week ranges', [
		'week 2,4 00:00-24:00',
		'week 2-4/2 00:00-24:00',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.02 00:00', '2012.01.09 00:00' ],
		[ '2012.01.16 00:00', '2012.01.23 00:00' ],
	], 1000 * 60 * 60 * 24 * (7 + 7), 0, false);

test.addTest('Week range limit', [
		'week 2-54 00:00-24:00',
		'week 2-54: 00:00-24:00',
		'week 2-57',
	], '2012.01.01 0:00', '2014.01.01 0:00', [
		[ '2012.01.02 00:00', '2013.01.01 00:00' ],
		[ '2013.01.07 00:00', '2014.01.01 00:00' ],
	], 1000 * 60 * 60 * 24 * 724, 0, false);

test.addTest('Monthday ranges', [
		'Jan 23-31 00:00-24:00; Feb 1-12 00:00-24:00',
		'Jan 23-Feb 12 00:00-24:00',
		'Jan 23-Feb 12: 00:00-24:00',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.23 0:00', '2012.02.13 00:00' ],
	], 1000 * 60 * 60 * 24 * 21, 0, false);

// test.addTest('Monthday ranges', [
// 		'Jan 23,25', // must be expressed as Jan 23,Jan 25
// 	], '2012.01.01 0:00', '2013.01.01 0:00', [
// 	], 1000 * 60 * 60 * 24 * 21, 0, false, {}, 'not last test');

test.addTest('Monthday ranges', [
		'Dec 24,Jan 2: 18:00-22:00',
		'Dec 24,Jan 2: 18:00-22:00; Jan 20: off',
		'Dec 24,Jan 2 18:00-22:00',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.02 18:00', '2012.01.02 22:00' ],
		[ '2012.12.24 18:00', '2012.12.24 22:00' ],
	], 1000 * 60 * 60 * (4 * 2), 0, false, {}, 'not last test');

test.addTest('Monthday ranges (with year)', [
		'2012 Jan 23-31 00:00-24:00; Feb 1-12 00:00-24:00 2012',
	], '2012.01.01 0:00', '2015.01.01 0:00', [
		[ '2012.01.23 0:00', '2012.02.13 00:00' ],
	], 1000 * 60 * 60 * 24 * 21, 0, false, {}, 'not last test');

test.addTest('Monthday ranges spanning year boundary', [
		'Dec 31-Jan 1',
	], '2012.01.01 0:00', '2014.01.01 0:00', [
		[ '2012.01.01 0:00', '2012.01.02 00:00' ],
		[ '2012.12.31 0:00', '2013.01.02 00:00' ],
		[ '2013.12.31 0:00', '2014.01.01 00:00' ],
	], 1000 * 60 * 60 * 24 * 4, 0, false, {}, 'not last test');

test.addTest('Full date (with year)', [
		'2013 Dec 31,2014 Jan 5',
		'2013 Dec 31; 2014 Jan 5',
		'2013-2013 Dec 31; 2014-2014 Jan 5', // force to use parseYearRange
	], '2011.01.01 0:00', '2015.01.01 0:00', [
		[ '2013.12.31 00:00', '2014.01.01 00:00' ],
		[ '2014.01.05 00:00', '2014.01.06 00:00' ],
	], 1000 * 60 * 60 * 24 * 2, 0, false);

test.addTest('Date range which only applies for one year', [
		'2013 Dec 31',
		'2013 Dec 31; 2014 Jan 5; 2014/1 off',
	], '2011.01.01 0:00', '2015.01.01 0:00', [
		[ '2013.12.31 0:00', '2014.01.01 00:00' ],
	], 1000 * 60 * 60 * 24, 0, false);

test.addTest('Monthday (with year) ranges spanning year boundary', [
		'2013 Dec 31-2014 Jan 2',
		'open; 2010 Jan 1-2013 Dec 30 off; 2014 Jan 3-2016 Jan 1 off',
	], '2011.01.01 0:00', '2015.01.01 0:00', [
		[ '2013.12.31 0:00', '2014.01.03 00:00' ],
	], 1000 * 60 * 60 * 24 * 3, 0, false, {}, 'not last test');

test.addTest('Monthday ranges with constrained weekday', [
		'Jan Su[2]-Jan 15',
	], '2012.01.01 0:00', '2015.01.01 0:00', [
		[ '2012.01.08 00:00', '2012.01.16 00:00' ], // 8
		[ '2013.01.13 00:00', '2013.01.16 00:00' ], // 3
		[ '2014.01.12 00:00', '2014.01.16 00:00' ], // 4
	], 1000 * 60 * 60 * 24 * (8 + 3 + 4), 0, false, {}, 'not only test');

test.addTest('Monthday ranges with constrained weekday', [
		'Jan 20-Jan Su[-1]',
	], '2012.01.01 0:00', '2015.01.01 0:00', [
		[ '2012.01.20 00:00', '2012.01.29 00:00' ],
		[ '2013.01.20 00:00', '2013.01.27 00:00' ],
		[ '2014.01.20 00:00', '2014.01.26 00:00' ],
	], 1000 * 60 * 60 * 24 * (9 + 7 + 6), 0, false, {}, 'not last test');

test.addTest('Monthday ranges with constrained weekday', [
		'Jan Su[1] +2 days-Jan Su[3] -2 days', // just for testing, can probably be expressed better
	], '2012.01.01 0:00', '2015.01.01 0:00', [
		[ '2012.01.03 00:00', '2012.01.13 00:00' ],
		[ '2013.01.08 00:00', '2013.01.18 00:00' ],
		[ '2014.01.07 00:00', '2014.01.17 00:00' ],
	], 1000 * 60 * 60 * 24 * (10 * 3), 0, false, {}, 'not last test');

test.addTest('Monthday ranges with constrained weekday spanning year', [
		'Dec 20-Dec Su[-1] +4 days',
	], '2011.01.01 0:00', '2015.01.01 0:00', [
		[ '2011.12.20 00:00', '2011.12.29 00:00' ],
		[ '2012.12.20 00:00', '2013.01.03 00:00' ],
		[ '2013.12.20 00:00', '2014.01.02 00:00' ],
		[ '2014.12.20 00:00', '2015.01.01 00:00' ],
	], 1000 * 60 * 60 * 24 * (9 + 11 + 3 + 11 + 2 + 11 + 1), 0, false, {}, 'not last test');

test.addTest('Monthday ranges with constrained', [
		'Nov Su[-1]-Dec Su[1] -1 day',
	], '2011.01.01 0:00', '2015.01.01 0:00', [
		[ '2011.11.27 00:00', '2011.12.03 00:00' ],
		[ '2012.11.25 00:00', '2012.12.01 00:00' ],
		[ '2013.11.24 00:00', '2013.11.30 00:00' ],
		[ '2014.11.30 00:00', '2014.12.06 00:00' ],
	], 1000 * 60 * 60 * 24 * ((4 + 2) + (6) + (6) + (1 + 5)), 0, false, {}, 'not last test');

test.addTest('Monthday ranges with constrained weekday spanning year', [
		ignored('Jan Su[1] -5 days-Jan 10'),
	], '2011.01.01 0:00', '2015.01.01 0:00', [
	], 1000 * 60 * 60 * 24 * (9 + 11 + 3 + 11 + 2 + 11 + 1), 0, false, {}, 'not last test');

test.addTest('Monthday ranges', [
		'Mar Su[-1]-Oct Su[-1] -1 day open; Oct Su[-1]-Mar Su[-1] -1 day off',
		'Mar Su[-1]-Oct Su[-1] -1 day open',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.03.25 00:00', '2012.10.27 00:00' ],
	], 18658800000, 0, false, {}, 'not last test');

test.addTest('Date range which only applies for specific year', [
		'2013,2015,2050-2053,2055/2,2020-2029/3,2060/1 Jan 1',
		'2013,2015,2050-2053,2055/2,2020-2029/3,2060/1 Jan 1 Mo-Su',
	], '2011.01.01 0:00', '2065.01.01 0:00', [
		[ '2013.01.01 00:00', '2013.01.02 00:00' ],
		[ '2015.01.01 00:00', '2015.01.02 00:00' ],
		[ '2020.01.01 00:00', '2020.01.02 00:00' ],
		[ '2023.01.01 00:00', '2023.01.02 00:00' ],
		[ '2026.01.01 00:00', '2026.01.02 00:00' ],
		[ '2029.01.01 00:00', '2029.01.02 00:00' ],
		[ '2050.01.01 00:00', '2050.01.02 00:00' ],
		[ '2051.01.01 00:00', '2051.01.02 00:00' ],
		[ '2052.01.01 00:00', '2052.01.02 00:00' ],
		[ '2053.01.01 00:00', '2053.01.02 00:00' ],
		[ '2055.01.01 00:00', '2055.01.02 00:00' ],
		[ '2057.01.01 00:00', '2057.01.02 00:00' ],
		[ '2059.01.01 00:00', '2059.01.02 00:00' ],
		[ '2060.01.01 00:00', '2060.01.02 00:00' ],
		[ '2061.01.01 00:00', '2061.01.02 00:00' ],
		[ '2062.01.01 00:00', '2062.01.02 00:00' ],
		[ '2063.01.01 00:00', '2063.01.02 00:00' ],
		[ '2064.01.01 00:00', '2064.01.02 00:00' ],
	], 1000 * 60 * 60 * 24 * 18, 0, false, {}, 'not last test');

test.addTest('Variable events', [
		'easter',
	], '2012.01.01 0:00', '2014.10.08 0:00', [
		[ '2012.04.08 00:00', '2012.04.09 00:00' ],
		[ '2013.03.31 00:00', '2013.04.01 00:00' ], // daylight saving time
		[ '2014.04.20 00:00', '2014.04.21 00:00' ],
	], 1000 * 60 * 60 * (24 * 3 - 1), 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Calculations based on variable events', [
		'easter +1 day open "Easter Monday"',
	], '2012.01.01 0:00', '2014.10.08 0:00', [
		[ '2012.04.09 00:00', '2012.04.10 00:00', false, 'Easter Monday' ],
		[ '2013.04.01 00:00', '2013.04.02 00:00', false, 'Easter Monday' ],
		[ '2014.04.21 00:00', '2014.04.22 00:00', false, 'Easter Monday' ],
	], 1000 * 60 * 60 * 24 * 3, 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Periodical monthdays', [
		'Jan 1-31/8 00:00-24:00',
		'Jan 1-31/8: 00:00-24:00',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.01 0:00', '2012.01.02 00:00' ],
		[ '2012.01.09 0:00', '2012.01.10 00:00' ],
		[ '2012.01.17 0:00', '2012.01.18 00:00' ],
		[ '2012.01.25 0:00', '2012.01.26 00:00' ],
	], 1000 * 60 * 60 * 24 * 4, 0, false);

test.addTest('Periodical monthdays', [
		'Jan 10-31/7',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.10 0:00', '2012.01.11 00:00' ],
		[ '2012.01.17 0:00', '2012.01.18 00:00' ],
		[ '2012.01.24 0:00', '2012.01.25 00:00' ],
		[ '2012.01.31 0:00', '2012.02.01 00:00' ],
	], 1000 * 60 * 60 * 24 * 4, 0, false, {}, 'not last test');

test.addTest('Selector order', [ // result should not depend on selector order
		'Feb week 6',
		'week 6 Feb',
		'00:00-24:00 week 6 Feb',
		'week 6 00:00-24:00 Feb',
		'week 6 Feb 00:00-24:00',
		'week 6 Feb Mo-Su 00:00-24:00',
		'Mo-Su week 6 Feb 00:00-24:00',
		'00:00-24:00 Mo-Su week 6 Feb',
		'00:00-24:00 week 6 Mo-Su Feb',
		'Mo-Su 00:00-24:00 week 6 Feb',
		'2012 00:00-24:00 week 6 Feb',
		'00:00-24:00 2012 week 6 Feb',
		'week 6 Feb 2012-2014',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.02.01 0:00', '2012.02.06 00:00' ],
	], 1000 * 60 * 60 * 24 * 5, 0, false);

test.addTest('Selector order', [
		'Feb week 7',
		'week 7 Feb',
		'week 7 Feb open',
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.02.06 0:00', '2012.02.13 00:00' ],
	], 1000 * 60 * 60 * 24 * 7, 0, false);

test.addTest('Input tolerance: case and whitespace', [
		'Mo,Tu,We,Th 12:00-20:00; 14:00-16:00 off', // reference value for prettify
		'   monday,    Tu, wE,   TH    12:00 - 20:00  ; 14:00-16:00	Off  ',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 12:00', '2012.10.01 14:00' ],
		[ '2012.10.01 16:00', '2012.10.01 20:00' ],
		[ '2012.10.02 12:00', '2012.10.02 14:00' ],
		[ '2012.10.02 16:00', '2012.10.02 20:00' ],
		[ '2012.10.03 12:00', '2012.10.03 14:00' ],
		[ '2012.10.03 16:00', '2012.10.03 20:00' ],
		[ '2012.10.04 12:00', '2012.10.04 14:00' ],
		[ '2012.10.04 16:00', '2012.10.04 20:00' ],
	], 1000 * 60 * 60 * 6 * 4, 0, true, {}, 'not last test');

test.addTest('Input tolerance: weekdays, months in different languages', [
		'Mo,Tu,We,Th 12:00-20:00; 14:00-16:00 off', // reference value for prettify
		'mon, Dienstag, Mi, donnerstag 12:00-20:00; 14:00-16:00 off',
		'mon, Tuesday, wed, Thursday 12:00-20:00; 14:00-16:00 off',
		'mon., Tuesday, wed., Thursday. 12:00-20:00; 14:00-16:00 off',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 12:00', '2012.10.01 14:00' ],
		[ '2012.10.01 16:00', '2012.10.01 20:00' ],
		[ '2012.10.02 12:00', '2012.10.02 14:00' ],
		[ '2012.10.02 16:00', '2012.10.02 20:00' ],
		[ '2012.10.03 12:00', '2012.10.03 14:00' ],
		[ '2012.10.03 16:00', '2012.10.03 20:00' ],
		[ '2012.10.04 12:00', '2012.10.04 14:00' ],
		[ '2012.10.04 16:00', '2012.10.04 20:00' ],
	], 1000 * 60 * 60 * 6 * 4, 0, true, {}, 'not last test');

test.addTest('Input tolerance: dot as time separator', [
		// '10:00-12:00', // reference value for prettify
		// '10.00-12.00',
		// '10.00-11.00,11.00-12.00',
		// '10.00-11.00;11.00-12.00',
		'10:00-14:00; 12:00-14:00 off', // reference value for prettify
		'10.00-14.00; 12.00-14.00 off',
		// '10.00-12.00;10.30-11.30',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 10:00', '2012.10.01 12:00' ],
		[ '2012.10.02 10:00', '2012.10.02 12:00' ],
		[ '2012.10.03 10:00', '2012.10.03 12:00' ],
		[ '2012.10.04 10:00', '2012.10.04 12:00' ],
		[ '2012.10.05 10:00', '2012.10.05 12:00' ],
		[ '2012.10.06 10:00', '2012.10.06 12:00' ],
		[ '2012.10.07 10:00', '2012.10.07 12:00' ],
	], 1000 * 60 * 60 * 2 * 7, 0, true);

test.addTest('Extensions: complex monthday ranges', [
		'Jan 23-31,Feb 1-12 00:00-24:00',
		'Jan 23-Feb 11,Feb 12 00:00-24:00', //
		ignored('Jan 23-30,31-Feb 1-2,3-12 12 00:00-24:00'), // FIXME: What should the ending '12' mean?
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.23 0:00', '2012.02.13 00:00' ],
	], 1000 * 60 * 60 * 24 * 21, 0, false, {}, 'not last test');

test.addTest('Extensions: missing time range separators', [
		'Mo 12:00-14:00 16:00-18:00 20:00-22:00', // returns a warning
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 12:00', '2012.10.01 14:00' ],
		[ '2012.10.01 16:00', '2012.10.01 18:00' ],
		[ '2012.10.01 20:00', '2012.10.01 22:00' ],
	], 1000 * 60 * 60 * 6, 0, true);

test.addTest('Selector combination', [
		'week 3 We',            // week + weekday
		'week 3 Jan 11-Jan 11', // week + monthday
		'week 3 Jan 11',        // week + monthday
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.11 0:00', '2012.01.12 00:00' ],
	], 1000 * 60 * 60 * 24, 0, false);

test.addTest('Selector combination', [
		'week 3 Jan',           // week + month
		'Jan-Feb Jan 9-Jan 15', // month + monthday
		'Jan-Feb Jan 9-15',     // month + monthday
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.09 0:00', '2012.01.16 00:00' ],
	], 1000 * 60 * 60 * 24 * 7, 0, false);

test.addTest('Selector combination', [
		'Jan We',           // month + weekday
		'Jan 2-27 We',      // weekday + monthday
		'Dec 30-Jan 27 We', // weekday + monthday
	], '2012.01.01 0:00', '2013.01.01 0:00', [
		[ '2012.01.04 0:00', '2012.01.05 00:00' ],
		[ '2012.01.11 0:00', '2012.01.12 00:00' ],
		[ '2012.01.18 0:00', '2012.01.19 00:00' ],
		[ '2012.01.25 0:00', '2012.01.26 00:00' ],
	], 1000 * 60 * 60 * 24 * 4, 0, false, {}, 'not last test');

test.addTest('Additional comments', [
		'Mo,Tu 10:00-16:00 open "no warranty"; We 12:00-18:00 open "female only"; Th closed "Not open because we are coding :)"; Fr 10:00-16:00 open "male only"; Sa 10:00-12:00 "Maybe open. Call us."',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 10:00', '2012.10.01 16:00', false, "no warranty" ],
		[ '2012.10.02 10:00', '2012.10.02 16:00', false, "no warranty" ],
		[ '2012.10.03 12:00', '2012.10.03 18:00', false, "female only" ],
		[ '2012.10.05 10:00', '2012.10.05 16:00', false, "male only" ],
		[ '2012.10.06 10:00', '2012.10.06 12:00', true, "Maybe open. Call us." ],
	], 1000 * 60 * 60 * 6 * 4, 1000 * 60 * 60 * 2, true);

test.addTest('Additional comments for unknown', [
		'Sa 10:00-12:00 "Maybe open. Call us. (testing special tokens in comment: ; ;; \' || | test end)"',
		'Sa 10:00-12:00 unknown "Maybe open. Call us. (testing special tokens in comment: ; ;; \' || | test end)"',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.06 10:00', '2012.10.06 12:00', true, "Maybe open. Call us. (testing special tokens in comment: ; ;; \' || | test end)" ],
	], 0, 1000 * 60 * 60 * 2, true, {}, 'not last test');

test.addTest('Date overwriting with additional comments for unknown ', [
		'Mo-Fr 10:00-20:00 unknown "Maybe"; We 10:00-16:00 "Maybe open. Call us."',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 10:00', '2012.10.01 20:00', true, "Maybe" ],
		[ '2012.10.02 10:00', '2012.10.02 20:00', true, "Maybe" ],
		[ '2012.10.03 10:00', '2012.10.03 16:00', true, "Maybe open. Call us." ],
		[ '2012.10.04 10:00', '2012.10.04 20:00', true, "Maybe" ],
		[ '2012.10.05 10:00', '2012.10.05 20:00', true, "Maybe" ],
	], 0, 1000 * 60 * 60 * (4 * 10 + 6), true);

test.addTest('Additional comments with time ranges spanning midnight', [
		'22:00-02:00 open "Lets party"; We 12:00-14:00 "Maybe open. Call us."',
		'22:00-26:00; We 12:00-14:00 unknown "Maybe open. Call us."',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 00:00', '2012.10.01 02:00', false, "Lets party" ],
		[ '2012.10.01 22:00', '2012.10.02 02:00', false, "Lets party" ],
		[ '2012.10.02 22:00', '2012.10.03 00:00', false, "Lets party" ],
		[ '2012.10.03 12:00', '2012.10.03 14:00', true, "Maybe open. Call us." ],
		[ '2012.10.04 00:00', '2012.10.04 02:00', false, "Lets party" ],
		[ '2012.10.04 22:00', '2012.10.05 02:00', false, "Lets party" ],
		[ '2012.10.05 22:00', '2012.10.06 02:00', false, "Lets party" ],
		[ '2012.10.06 22:00', '2012.10.07 02:00', false, "Lets party" ],
		[ '2012.10.07 22:00', '2012.10.08 00:00', false, "Lets party" ],
	], 1000 * 60 * 60 * 4 * 6, 1000 * 60 * 60 * 2, true);

test.addTest('Additional comments for closed with time ranges spanning midnight', [
		'22:00-26:00; We 12:00-14:00 off "Not open because we are too tired"',
		'22:00-26:00; We 12:00-14:00 closed "Not open because we are too tired"',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 00:00', '2012.10.01 02:00' ],
		[ '2012.10.01 22:00', '2012.10.02 02:00' ],
		[ '2012.10.02 22:00', '2012.10.03 02:00' ],
		[ '2012.10.03 22:00', '2012.10.04 02:00' ],
		[ '2012.10.04 22:00', '2012.10.05 02:00' ],
		[ '2012.10.05 22:00', '2012.10.06 02:00' ],
		[ '2012.10.06 22:00', '2012.10.07 02:00' ],
		[ '2012.10.07 22:00', '2012.10.08 00:00' ],
	], 1000 * 60 * 60 * 4 * 7, 0, true, {}, 'not last test');

// proposed by Netzwolf: http://www.netzwolf.info/en/cartography/osm/time_domain/specification#rule9
// Currently not handled correctly. Could be interpreted as fallback block.
test.addTest('Additional comments for unknown', [
		ignored('Mo open "comment"; "I don’t know how to express easter": off'),
	], '2012.10.01 0:00', '2012.10.08 0:00', [
	], 0, 1000 * 60 * 60 * 2, true, {}, 'not last test');

test.addTest('Additional comments combined with additional blocks', [
		'Mo 12:00-14:00 open "female only", Mo 14:00-16:00 open "male only"',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 12:00', '2012.10.01 14:00', false, 'female only' ],
		[ '2012.10.01 14:00', '2012.10.01 16:00', false, 'male only' ],
	], 1000 * 60 * 60 * 4, 0, true, {}, 'not last test');

// did only not work in browser: drawTable
test.addTest('Additional comments combined with months', [
		'Apr-Sep; Oct-Dec "on request"',
		'Oct-Dec "on request"; Apr-Sep',
	], '2012.07.01 0:00', '2012.11.01 0:00', [
		[ '2012.07.01 00:00', '2012.10.01 00:00' ],
		[ '2012.10.01 00:00', '2012.11.01 00:00', true,  'on request' ],
	], 7948800000, 2682000000, false, {}, 'not last test');

test.addTest('Complex example used in README', [
		'00:00-24:00; Tu-Su 08:30-09:00 off; Tu-Su 14:00-14:30 off; Mo 08:00-13:00 off',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 00:00', '2012.10.01 08:00' ],
		[ '2012.10.01 13:00', '2012.10.02 08:30' ],
		[ '2012.10.02 09:00', '2012.10.02 14:00' ],
		[ '2012.10.02 14:30', '2012.10.03 08:30' ],
		[ '2012.10.03 09:00', '2012.10.03 14:00' ],
		[ '2012.10.03 14:30', '2012.10.04 08:30' ],
		[ '2012.10.04 09:00', '2012.10.04 14:00' ],
		[ '2012.10.04 14:30', '2012.10.05 08:30' ],
		[ '2012.10.05 09:00', '2012.10.05 14:00' ],
		[ '2012.10.05 14:30', '2012.10.06 08:30' ],
		[ '2012.10.06 09:00', '2012.10.06 14:00' ],
		[ '2012.10.06 14:30', '2012.10.07 08:30' ],
		[ '2012.10.07 09:00', '2012.10.07 14:00' ],
		[ '2012.10.07 14:30', '2012.10.08 00:00' ],
	], 1000 * 60 * 60 * (24 * 7 - 5 - 0.5 * 6 - 0.5 * 6), 0, true, {}, 'not last test');

test.addTest('Complex example used in README and benchmark', [
		'Mo,Tu,Th,Fr 12:00-18:00; Sa 12:00-17:00; Th[3] off; Th[-1] off',
		'Mo,Tu,Th,Fr 12:00-18:00; Sa 12:00-17:00; Th[3],Th[-1] off',
	], '2012.10.01 0:00', '2012.10.31 0:00', [
		[ '2012.10.01 12:00', '2012.10.01 18:00' ],
		[ '2012.10.02 12:00', '2012.10.02 18:00' ],
		[ '2012.10.04 12:00', '2012.10.04 18:00' ],
		[ '2012.10.05 12:00', '2012.10.05 18:00' ],
		[ '2012.10.06 12:00', '2012.10.06 17:00' ],
		[ '2012.10.08 12:00', '2012.10.08 18:00' ],
		[ '2012.10.09 12:00', '2012.10.09 18:00' ],
		[ '2012.10.11 12:00', '2012.10.11 18:00' ],
		[ '2012.10.12 12:00', '2012.10.12 18:00' ],
		[ '2012.10.13 12:00', '2012.10.13 17:00' ],
		[ '2012.10.15 12:00', '2012.10.15 18:00' ],
		[ '2012.10.16 12:00', '2012.10.16 18:00' ],
		[ '2012.10.19 12:00', '2012.10.19 18:00' ],
		[ '2012.10.20 12:00', '2012.10.20 17:00' ],
		[ '2012.10.22 12:00', '2012.10.22 18:00' ],
		[ '2012.10.23 12:00', '2012.10.23 18:00' ],
		[ '2012.10.26 12:00', '2012.10.26 18:00' ],
		[ '2012.10.27 12:00', '2012.10.27 17:00' ],
		[ '2012.10.29 12:00', '2012.10.29 18:00' ],
		[ '2012.10.30 12:00', '2012.10.30 18:00' ],
	], 1000 * 60 * 60 * (6 * 16 + 5 * 4), 0, false, {}, 'not last test');

test.addTest('Calculations based on variable events', [
		'2012 easter -2 days-2012 easter +2 days: open "Around easter"',
		'easter -2 days-easter +2 days: open "Around easter"',
	], '2012.01.01 0:00', '2012.10.08 0:00', [
		[ '2012.04.06 00:00', '2012.04.10 00:00', false, 'Around easter' ],
	], 1000 * 60 * 60 * 24 * 4, 0, false, nominatiomTestJSON, 'not only test');

test.addTest('Calculations based on variable events', [
		'Apr 5-easter -1 day: open "Before easter"',
	], '2012.01.01 0:00', '2012.10.08 0:00', [
		[ '2012.04.05 00:00', '2012.04.07 00:00', false, 'Before easter' ],
	], 1000 * 60 * 60 * 24 * 2, 0, false, nominatiomTestJSON, 'not only test');

test.addTest('Calculations based on variable events', [
		'easter-Apr 20: open "Around easter"',
	], '2012.01.01 0:00', '2012.10.08 0:00', [
		[ '2012.04.08 00:00', '2012.04.21 00:00', false, 'Around easter' ],
	], 1000 * 60 * 60 * 24 * 13, 0, false, nominatiomTestJSON, 'not last test');

test.addTest('Calculations based on variable events', [
		'easter-Apr 2: open "Around easter"',
	], '2012.01.01 0:00', '2012.10.08 0:00', [
		[ '2012.01.01 00:00', '2012.04.03 00:00', false, 'Around easter' ],
		[ '2012.04.08 00:00', '2012.10.08 00:00', false, 'Around easter' ],
	], 23842800000, 0, false, nominatiomTestJSON, 'not last test');

// The hard stuff. Proposed by Netzwolf: http://www.netzwolf.info/en/cartography/osm/time_domain/form_hours#check
// Currently used around 6 times: /\d\s*-\s*(mo|tu|we|th|fr|sa|su)\b/
test.addTest('Calculations based on month range', [
		ignored('Mar Su[-1] - Dec 25-Su-28 days: 12:00-13:00'),
	], '2012.01.01 0:00', '2012.10.08 0:00', [
	], 1000 * 60 * 60 * 24 * 13, 0, false, nominatiomTestJSON, 'not only test');

test.addTest('Time intervals (not specified/documented use of colon, please avoid this)', [
		'open; Mo: 15:00-16:00 off', // The colon between weekday and time range is ignored. This is used in OSM.
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 00:00', '2012.10.01 15:00' ],
		[ '2012.10.01 16:00', '2012.10.08 00:00' ],
	], 1000 * 60 * 60 * (24 * 6 + 23), 0, true, {}, 'not last test');

test.addTest('Points in time, mode 1', [
		'Mo 12:00,15:00; Tu-Fr 14:00',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 12:00', '2012.10.01 12:01' ],
		[ '2012.10.01 15:00', '2012.10.01 15:01' ],
		[ '2012.10.02 14:00', '2012.10.02 14:01' ],
		[ '2012.10.03 14:00', '2012.10.03 14:01' ],
		[ '2012.10.04 14:00', '2012.10.04 14:01' ],
		[ '2012.10.05 14:00', '2012.10.05 14:01' ],
	], 1000 * 60 * 6, 0, false, nominatiomTestJSON, 'not last test', 1);

test.addTest('Points in time, mode 1', [
		'Mo sunrise,sunset',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 07:22', '2012.10.01 07:23' ],
		[ '2012.10.01 19:00', '2012.10.01 19:01' ],
	], 1000 * 60 * 2, 0, false, nominatiomTestJSON, 'not last test', 1);

test.addTest('Points in time, mode 2', [
		'Mo sunrise,sunset',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 07:22', '2012.10.01 07:23' ],
		[ '2012.10.01 19:00', '2012.10.01 19:01' ],
	], 1000 * 60 * 2, 0, false, nominatiomTestJSON, 'not last test', 2);

test.addTest('Points in time, mode 2', [
		'Mo (sunrise+01:00)',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 08:22', '2012.10.01 08:23' ],
	], 1000 * 60 * 1, 0, false, nominatiomTestJSON, 'not last test', 2);

test.addTest('Points in time and times ranges, mode 2', [
		'Mo 12:00,13:00-14:00',
		'Mo 13:00-14:00,12:00',
	], '2012.10.01 0:00', '2012.10.08 0:00', [
		[ '2012.10.01 12:00', '2012.10.01 12:01' ],
		[ '2012.10.01 13:00', '2012.10.01 14:00' ],
	], 1000 * 60 * (1 + 60), 0, false, nominatiomTestJSON, 'not last test', 2);

test.addShouldWarn('Value not ideal (probably wrong). Should throw a warning.', [
		// 'Mo[2] - 6 days', // considered as "correct"
		'Mo[2] - 0 days', // pointless
		'Mo&Th',
		'Mon',
		'12.00-14:00',
		'24/7; 12:00-14:00 off',
		'2013-2015/1',
		'2013,2015,2050-2053,2055/2,2020-2029/3,2060-2065/1 Jan 1',
		'Mo: 15:00-16:00 off', // The colon between weekday and time range is ignored. This is used in OSM.
		'Mo-Do 8:30-20:00 Fr 8:29-18:00',
		'Mo 12:00-14:00 16:00-18:00 20:00-22:00',
		'Mo-So: 08:00-22:00',
		'Mo Tu Fr',
		'Jan Dec',
		'"testing" "second comment"',
		'Jan 12:00-13:00 Mo 15:00-16:00',
		// 'easter + 353 days', // Does throw an error, but at runtime when the problem occurs respectivly with the call of getWarnings().
	], {}, 'not last test');

test.addShouldFail('Incorrect syntax which should throw an error', [
		'Mo[2] - 7 days',
		'sdasdlasdj a3reaw', // Test for the test framwork. This test should pass :)
		':week 2-54 00:00-24:00',
		':::week 2-54 00:00-24:00',
		'week :2-54 00:00-24:00',
		'week 2-54 00:00-24:00:',
		'week 2-54 00:00-24:00:::',
		'week 2-54 00::00-24:00',
		'(sunrise+01:00-sunset',
		'(sunrise+01::)-sunset',
		'(sunrise)-sunset',
		'(',
		'sunrise-(',
		'sunrise-sunset,(',
		'27:00-29:00',
		'', // empty string
		';', // only block delimiter
		'||', // only block delimiter
		// '12:00-14:00 ||',
		' ', // empty string
		"\n", // newline
		'14:/',
		'14:00/',
		'14:00-/',
		'26:00-27:00',
		'23:00-55:00',
		'14:00-16:00,.',
		'21:00-22:60',
		'21:60-22:59',
		// '14:00-16:00,', // is ok
		'Sa[1.',
		'Sa[1,0,3]',
		'Sa[1,3-6]',
		'Sa[1,3-.]',
		'Sa[1,3,.]',
		'PH + 2 day', // Normally moving PH one day is everything needed. Handling more than one move day would be harder to implement.
		'Su-PH',      // not accepted syntax
		'2012, Jan',
		'easter + 370 days',
		'easter - 2 days - 2012 easter + 2 days: open "Easter Monday"',
		'2012 easter - 2 days - easter + 2 days: open "Easter Monday"',
		// 'easter + 198 days', // Does throw an error, but at runtime when the problem occurs.
	], nominatiomTestJSON, 'not last test');

test.addShouldFail('Missing information (e.g. country or holidays not defined in this lib)', [
		'PH', // country is not specified
		'SH', // country is not specified
	]);

test.addShouldFail('opening_hours.js is in the wrong mode.', [
		'Mo sunrise,sunset', // only in mode 1 or 2, default is 0
	], nominatiomTestJSON, 'not last test');

test.addCompMatchingRule('Compare result from getMatchingRule()', [
		'10:00-16:00',
		'10:00-16:00;',
		'08:00-10:00; 10:00-16:00;',
		'"testing"; 10:00-16:00; 08:00-10:00;',
	], '2012.01.01 13:00',
	'10:00-16:00', {}, 'not only test');

test.addCompMatchingRule('Compare result from getMatchingRule()', [
		'Mo 11:00-14:30 "specific unknown for this time" || "general unknown"',
		'Mo 11:00-14:30 "specific unknown for this time"|| "general unknown"',
	], '2013.10.07 13:00',
	'Mo 11:00-14:30 "specific unknown for this time"', {}, 'n only test');

test.addCompMatchingRule('Compare result from getMatchingRule()', [
		'Mo 11:00-14:30 "specific unknown for this time" || "general unknown"',
		'Mo 11:00-14:30 "specific unknown for this time" ||"general unknown" ',
	], '2012.01.01 09:00',
	'"general unknown"', {}, 'n last test');

process.exit(test.run() ? 0 : 1);

//======================================================================
// Test framework
//======================================================================
function opening_hours_test() {
	var show_passing_tests  = true;
	var show_error_warnings = false; // enable this, if you want to see how the library reports errors and warnings
	var tests = [];
	var tests_should_fail = [];
	var tests_should_warn = [];
	var tests_comp_matching_rule = [];

	function runSingleTestShouldFail(name, value, nominatiomJSON) {
		try {
			// since they should fail anyway we can give them the nominatiomTestJSON
			oh = new opening_hours(value, nominatiomJSON);

			crashed = false;
		} catch (err) {
			crashed = err;
		}

		var passed = false;
		var str = '"' + name + '" for "' + value.replace('\n', '*newline*') + '": ';
		if (crashed) {
			str += '[1;32mPASSED[0m';
			passed = true;

			if (show_passing_tests) {
				console.log(str);
				if (show_error_warnings)
					console.log(crashed + '\n');
			}
		} else {
			str += '[1;31mFAILED[0m';
			console.log(str);
		}

		return crashed;
	}

	function runSingleTestShouldThrowWarning(name, value, nominatiomJSON) {
		var warnings, oh;
		try {
			oh = new opening_hours(value, nominatiomJSON);

			warnings = oh.getWarnings();
			crashed = false;
		} catch (err) {
			crashed = err;
		}

		var passed = false;
		var str = '"' + name + '" for "' + value.replace('\n', '*newline*') + '": ';
		if (!crashed && warnings.length > 0) {
			str += '[1;32mPASSED[0m';
			passed = true;
			if (show_passing_tests)
				console.log(str);
			if (show_error_warnings)
				console.log(warnings.join('\n'));
			return true;
		} else {
			str += '[1;31mFAILED[0m';
			console.log(str);
			if (show_error_warnings)
				console.log(crashed + '\n');
		}
		return false;
	}

	function runSingleTest(name, value, first_value, from, to, expected_intervals, expected_durations, expected_weekstable, nominatiomJSON, oh_mode) {
		var ignored = typeof value !== 'string';
		if (ignored) {
			ignored = value[1];
			value   = value[0];
		}

		var oh, intervals, durations, weekstable, prettified, intervals_ok, duration_ok, weekstable_ok, prettify_ok, crashed = true;

		var warnings;
		try {
			oh = new opening_hours(value, nominatiomJSON, oh_mode);

			warnings = oh.getWarnings();

			intervals  = oh.getOpenIntervals(new Date(from), new Date(to));
			durations  = oh.getOpenDuration(new Date(from), new Date(to));
			weekstable = oh.isWeekStable();
			prettified = oh.prettifyValue();

			intervals_ok  = typeof expected_intervals  === 'undefined' || intervals.length == expected_intervals.length;
			duration_ok   = (typeof expected_durations[0] === 'undefined' || durations[0] === expected_durations[0])
				&& (typeof expected_durations[1] === 'undefined' || durations[1] === expected_durations[1]);
			weekstable_ok = typeof expected_weekstable === 'undefined' || weekstable === expected_weekstable;
			prettify_ok   = typeof prettified === 'undefined' || prettified === value || prettified === first_value;
			// prettify_ok = true;

			crashed = false;
		} catch (err) {
			crashed = err;
		}

		if (intervals_ok) {
			for (var interval = 0; interval < intervals.length; interval++) {
				var expected_from = new Date(expected_intervals[interval][0]);
				var expected_to   = new Date(expected_intervals[interval][1]);

				if (intervals[interval][0].getTime() != expected_from.getTime()
						|| intervals[interval][1].getTime() != expected_to.getTime()
						|| (typeof intervals[interval][2] !== 'undefined'
							&& intervals[interval][2] !== expected_intervals[interval][2])
						|| (typeof intervals[interval][3] !== 'undefined'
							&& intervals[interval][3] !== expected_intervals[interval][3])
						)
					intervals_ok = false;
			}
		}

		var passed = false;
		var str = '"' + name + '" for "' + value + '": ';
		var failed = false;
		if (intervals_ok && duration_ok && prettify_ok && (weekstable_ok || ignored == 'check for week stable not implemented')) {
			str += '[1;32mPASSED[0m';
			if (ignored) {
				if (ignored == 'check for week stable not implemented') {
					str += ', [1;33mexcept weekstable which is ignored for now[0m';
				} else {
					str += ', [1;33malso ignored, please unignore since the test passes![0m';
				}
			}
			passed = true;
		} else if (ignored) {
			str += '[1;33mIGNORED[0m, reason: ' + ignored;
			passed = true;
		} else if (crashed) {
			str += '[1;35mCRASHED[0m, reason: ' + crashed;
		} else {
			str += '[1;31mFAILED[0m';
			if (!duration_ok)
				str += ', bad duration(s): ' + durations + ', expected ' + expected_durations;
			if (!intervals_ok)
				str += ', bad intervals: \n' + intervalsToString(intervals) + '\nexpected:\n' + intervalsToString(expected_intervals);
			if (!weekstable_ok)
				str += ', bad weekstable flag: ' + weekstable + ', expected ' + expected_weekstable;
			if (!prettify_ok)
				str += ', bad prettified value: "' + prettified + '", expected either value or "' + first_value + '"';
			// console.log(intervals);
			failed = true;

			if (show_error_warnings && warnings.length > 0)
				str += '\n' + warnings.join('\n');
		}

		if ((intervals_ok && duration_ok && weekstable_ok && show_passing_tests) || crashed || failed || ignored)
			console.log(str);
		return passed;
	}

	function runSingleTestCompMatchingRule(name, value, date, matching_rule, nominatiomJSON) {
		try {
			// since they should fail anyway we can give them the nominatiomTestJSON
			oh = new opening_hours(value, nominatiomJSON);
			it = oh.getIterator(new Date(date));

			crashed = false;
		} catch (err) {
			crashed = err;
		}

		var matching_rule_ok = it.getMatchingRule() == matching_rule;

		var passed = false;
		var str = '"' + name + '" for "' + value.replace('\n', '*newline*') + '": ';
		if (!crashed && matching_rule_ok) {
			str += '[1;32mPASSED[0m';
			passed = true;

			if (show_passing_tests)
				console.log(str);
		} else if (crashed) {
			str += '[1;35mCRASHED[0m, reason: ' + crashed;
			console.log(str);
		} else {
			str += '[1;31mFAILED[0m for time ' + new Date(date);
			str += ', bad matching rule: "' + it.getMatchingRule() + '", expected "' + matching_rule + '"';
			console.log(str);
		}

		return passed;
	}

	function intervalsToString(intervals) {
		var res = '';

		if (intervals.length == 0)
			return '(none)';

		for (var interval = 0; interval < intervals.length; interval++) {
			var item = intervals[interval];
			var from = formatDate(item[0]);
			var to   = formatDate(item[1]);
			var comment = typeof item[3] !== 'undefined' ? '\'' + item[3] + '\'' : item[3];

			if (interval != 0)
				res += '\n';

			res += '[ \'' + from + '\', \'' + to + '\', ' + item[2]  + ', ' + (item[2] ? ' ' : '')+ comment + ' ],';
		}

		return res;
	}

	function formatDate(date) {
		if (typeof date === 'string')
			return date;

		var res = '';
		res += date.getFullYear() + '.';
		res += ('0' + (date.getMonth() + 1)).substr(-2, 2) + '.';
		res += ('0' + date.getDate()).substr(-2, 2) + ' ';
		res += ('0' + date.getHours()).substr(-2, 2) + ':';
		res += ('0' + date.getMinutes()).substr(-2, 2);
		return res;
	}

	this.run = function() {
		var tests_length = tests.length + tests_should_fail.length + tests_should_warn.length + tests_comp_matching_rule.length;
		var success = 0;
		for (var test = 0; test < tests.length; test++) {
			if (runSingleTest(tests[test][0], tests[test][1], tests[test][2], tests[test][3], tests[test][4], tests[test][5], tests[test][6], tests[test][7], tests[test][8], tests[test][9]))
				success++;
		}
		for (var test = 0; test < tests_should_warn.length; test++) {
			if (runSingleTestShouldThrowWarning(tests_should_warn[test][0], tests_should_warn[test][1], tests_should_warn[test][2]))
				success++;
		}
		for (var test = 0; test < tests_should_fail.length; test++) {
			if (runSingleTestShouldFail(tests_should_fail[test][0], tests_should_fail[test][1], tests_should_fail[test][2]))
				success++;
		}
		for (var test = 0; test < tests_comp_matching_rule.length; test++) {
			if (runSingleTestCompMatchingRule(tests_comp_matching_rule[test][0], tests_comp_matching_rule[test][1],
					tests_comp_matching_rule[test][2], tests_comp_matching_rule[test][3]))
				success++;
		}

		console.log(success + '/' + tests_length + ' tests passed');

		return success == tests_length;
	}

	this.last = false; // If set to true, no more tests are added to the testing queue.
	// This might be useful for testing to avoid to comment tests out and something like that …

	this.addTest = function(name, values, from, to, expected_intervals, expected_duration, expected_unknown_duration, expected_weekstable, nominatiomJSON, last, oh_mode) {

		if (this.last == true) return;
		this.handle_only_test(last);

		for (var expected_interval = 0; expected_interval < expected_intervals.length; expected_interval++) {
			// Set default of unknown to false. If you expect something else you
			// will have to specify it.
			if (typeof expected_intervals[expected_interval][2] === 'undefined')
				expected_intervals[expected_interval][2] = false;
		}
		if (typeof values === 'string')
			tests.push([name, values, values, from, to, expected_intervals,
				[ expected_duration, expected_unknown_duration ], expected_weekstable, nominatiomJSON, oh_mode]);
		else
			for (var value = 0; value < values.length; value++)
				tests.push([name, values[value], values[0], from, to, expected_intervals,
					[ expected_duration, expected_unknown_duration ], expected_weekstable, nominatiomJSON, oh_mode]);
	}

	this.addShouldFail = function(name, values, nominatiomJSON, last) {
		if (this.last == true) return;
		this.handle_only_test(last);

		if (typeof values === 'string')
			tests_should_fail.push([name, values, nominatiomJSON]);
		else
			for (var value = 0; value < values.length; value++)
				tests_should_fail.push([name, values[value], nominatiomJSON]);
	}
	this.addShouldWarn = function(name, values, nominatiomJSON, last) {
		if (this.last == true) return;
		this.handle_only_test(last);

		if (typeof values == 'string')
			tests_should_warn.push([name, values, nominatiomJSON]);
		else
			for (var value = 0; value < values.length; value++)
				tests_should_warn.push([name, values[value], nominatiomJSON]);
	}
	this.addCompMatchingRule = function(name, values, date, matching_rule, nominatiomJSON, last) {
		if (this.last == true) return;
		this.handle_only_test(last);

		if (typeof values == 'string')
			tests_comp_matching_rule.push([name, values, matching_rule, nominatiomJSON]);
		else
			for (var value = 0; value < values.length; value++)
				tests_comp_matching_rule.push([name, values[value], date, matching_rule, nominatiomJSON]);
	}
	this.handle_only_test = function (last) {
		if (last === 'only test') {
			tests = [];
			tests_should_fail = [];
			tests_should_warn = [];
			tests_comp_matching_rule = [];
		}
		if (last === 'only test' || last === 'last test') this.last = true;
	}
}

function ignored(value, reason) {
	if (typeof reason === 'undefined')
		reason = 'not implemented yet';
	return [ value, reason ];
}
