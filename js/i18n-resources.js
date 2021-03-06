// localization {{{
var resources = { // English is fallback language.
    en: { translation: {
            "lang": {
                "en": "English",
                "de": "German",
                "ru": "Russian",
                "choose": "Choose Language",
            },
            "months": {
                "short": {
                    "jan": "Jan",
                    "feb": "Feb",
                    "mar": "Mar",
                    "apr": "Apr",
                    "may": "May",
                    "jun": "Jun",
                    "jul": "Jul",
                    "aug": "Aug",
                    "sep": "Sep",
                    "oct": "Oct",
                    "nov": "Nov",
                    "dec": "Dec",
                },
                "full": {
                    "jan": "January",
                    "feb": "February",
                    "mar": "March",
                    "apr": "April",
                    "may": "May",
                    "jun": "June",
                    "jul": "July",
                    "aug": "August",
                    "sep": "September",
                    "oct": "October",
                    "nov": "November",
                    "dec": "December",
                },
            },

            "weekdays": {
                "short": {
                    "su": "Su",
                    "mo": "Mo",
                    "tu": "Tu",
                    "we": "We",
                    "th": "Th",
                    "fr": "Fr",
                    "sa": "Sa",
                },
                "full": {
                    "su": "Sunday",
                    "mo": "Monday",
                    "tu": "Tuesday",
                    "we": "Wednesday",
                    "th": "Thursday",
                    "fr": "Friday",
                    "sa": "Saturday",
                },
                "word next": { // The Russian language seems to use other words for next for some weekdays.
                    "su": "next",
                    "mo": "next",
                    "tu": "next",
                    "we": "next",
                    "th": "next",
                    "fr": "next",
                    "sa": "next",
                }
            },
            "texts": {
                "open always": "Facility is always open",
                "unknown always": "Facility is always maybe open",
                "closed always": "Facility is always closed",
                "open now": "Facility is now open",
                "facilitiy which is open now": "Only facilities which are open now",
                "facilitiy which is open/unknown now": "Only facilities which are open or unknown now",
                "facilitiy which is unknown now": "Only facilities which might be open now",
                "facilitiy which is closed now": "Only facilities which are closed now",
                "unknown now": "Facility might be open now",
                "closed now": "Facility is now closed",
                "will close": "but <a href=\"__href__\">will</a> close __timestring__.",
                "will unknown": "but <a href=\"__href__\">will</a> maybe open __timestring__.",
                "will open": "but <a href=\"__href__\">will</a> open __timestring__.",
                "depends on": ", but that depends on __comment__.",
                "week stable": "Schedule is valid in any given week.",
                "not week stable": "Attention! This schedule might change for other weeks.",
                "value for": "value for",
                "MatchingRule": "Substring used by applied rule",
                "warn error": "Error and warning messages",
                "prettified value": "prettified and opening_hours value (this value can be safely used in OSM, after all warnings have been solved)",
                "prettified value for displaying": "prettified opening_hours value for displaying (including newlines, do not use this as value for OSM)",
                "more information": "For more information you can check out the <a __href__>OSM wiki</a>.",
                "this website": "This website and the JavaScript library used for the evaluation of opening hours is developed on <a href=\"__url__\" target=\"_blank\">__hoster__</a>.",
                "if PH is between Mo and Fr": "Only if the public holiday is a weekday (Mo-Fr)",
                "check out error correction, prettify": "check out the error correction and the prettify function for the opening_hours value",
                "SH,PH or PH,SH": "This makes a small difference compared to the previous value. The name of the school holidays will override the PH names in the comment.",
                "config POIs": "configure POIs",
                "reload map": "reload map",
                "heading map": "Map with layer for the tag opening_hours",
                "map is showing": '<a href="__mapUrl__">Without filter</a> this map is showing nodes with the tag <a rel="external" href="__wikiUrl__">opening_hours</a> as colored circles:',
                "error": "The value could not be parsed",
                "warning": "If there appeared warnings during evaluation, a blue __sign__ will show up in the status icon.",
                "map filter": "There are a few filters which can be applied to find and fix mistakes (QA) or to just display open or closed facilities:",
                "warnings only": "Warnings only",
                "error only": "Error only",
                "data source": 'The overlay data comes from the __APIaTag__. The map is __OSMaTag__.',
                "mode 0": 'Only time ranges are excepted (tags opening_hours, lit)',
                "mode 1": 'Only points in time are excepted',
                "mode 2": 'Time ranges and points in time are excepted (tags service_times, collection_times)',
            },
            "words": {
                "mode": "evaluation mode",
                "green": "green",
                "yellow": "yellow",
                "red": "red",
                "violet": "violet",
                "to": "to",
                "and": "and",
                "no": "no",
                "his": "his",
                "docu": "documentation",
                "of course": "of course",
                "open": "open",
                "unknown": "unknown",
                "closed": "closed",
                "comment": "comment",
                "today": "today",
                "tomorrow": "tomorrow",
                // "on weekday": "on", // not needed in this context
                "on weekday": " ",
                "in duration": "in",
                "region": "region",
                "position": "position",
                "lat": "latitude",
                "lon": "longitude",
                "country": "country",
                "state": "state",
                "status": "status",
                "examples": "Examples",
                "none": "none",
                "date": "date",
                "time": { // __count__ Can not cover need for Russian language (one, several, many).
                    "minute": "minute",
                    "minute plural": "minutes",
                    "minute many": "minutes",
                    "hour": "hour",
                    "hour plural": "hours",
                    "hour many": "hours",
                    "day": "day",
                    "day plural": "days",
                    "day many": "days",
                    "hours minutes sep": "and ",
                    "now": "now",
                    "time": "time",
                },
            },
        },
    },
    de: { translation: {
            "lang": {
                "en": "Englisch",
                "de": "Deutsch",
                "ru": "Russisch",
                "choose": "Wähle eine Sprache",
            },
            "months": {
                "short": {
                    "mar": "Mär",
                    "may": "Mai",
                    "oct": "Okt",
                    "dec": "Dez",
                },
                "full": {
                    "jan": "Januar",
                    "feb": "Februar",
                    "mar": "März",
                    "may": "Mai",
                    "jun": "Juni",
                    "jul": "Juli",
                    "oct": "Oktober",
                    "dec": "Dezember",
                },
            },

            "weekdays": {
                "short": {
                    "su": "So",
                    "mo": "Mo",
                    "tu": "Di",
                    "we": "Mi",
                    "th": "Do",
                    "fr": "Fr",
                    "sa": "Sa",
                },
                "full": {
                    "su": "Sonntag",
                    "mo": "Montag",
                    "tu": "Dienstag",
                    "we": "Mittwoch",
                    "th": "Donnerstag",
                    "fr": "Freitag",
                    "sa": "Samstag",
                },
                "word next": {
                    "su": "nächsten",
                    "mo": "nächsten",
                    "tu": "nächsten",
                    "we": "nächsten",
                    "th": "nächsten",
                    "fr": "nächsten",
                    "sa": "nächsten",
                }
            },
            "texts": {
                "open always": "Die Einrichtung hat immer geöffnet.",
                "unknown always": "Die Öffnungszeit der Einrichtung ist immer unbekannt",
                "closed always": "Die Einrichtung hat nie geöffnet.",
                "open now": "Die Einrichtung hat jetzt geöffnet",
                "facilitiy which is open now": "Nur Einrichtungen welche jetzt geöffnet sind",
                "facilitiy which is open/unknown now": "Nur Einrichtungen die jetzt geöffnet oder unbekannt sind",
                "facilitiy which is unknown now": "Nur Einrichtungen die möglicherweise jetzt geöffnet sind",
                "facilitiy which is closed now": "Nur Einrichtungen die jetzt geschlossen sind",
                "unknown now": "Die Einrichtung ist möglicherweise jetzt geöffnet",
                "closed now": "Die Einrichtung ist jetzt geschlossen",
                "will close": "aber <a href=\"__href__\">wird</a> __timestring__ schließen.",
                "will unknown": "aber <a href=\"__href__\">wird</a> eventuell __timestring__ öffnen.",
                "will open": "aber <a href=\"__href__\">wird</a> __timestring__ öffnen.",
                "depends on": ", abhängig von __comment__.",
                "week stable": "Dieser Wochenplan gilt für jede Woche.",
                "not week stable": "Achtung! Dieser Wochenplan kann sich in anderen Wochen ändern.",
                "value for": "Wert für",
                "MatchingRule": "Zur Anwendung gekommene Regel",
                "warn error": "Fehler und Warnungen",
                "prettified value": "Schön formatierter opening_hours Wert (dieser Wert sollte in OSM verwendet werden, nachdem alle Warnungen beseitigt wurden)",
                "prettified value for displaying": "Schön formatierter opening_hours Wert für die Anzeige (mit Zeilenumbrüchen, nicht als Tag für OSM gedacht …)",
                "more information": "Für weitere Informationen kannst dir das <a __href__>OSM wiki</a> anschauen.",
                "this website": "Die Entwicklung dieser Webseite und der JavaScript Bibliothek zur Auswertung der Öffnungszeiten findet auf <a href=\"__url__\" target=\"_blank\">__hoster__</a> statt.",
                "if PH is between Mo and Fr": "Nur wenn der Feiertag auf einen Wochentag (Mo-Fr) fällt",
                "check out error correction, prettify": "Probiere die Fehlererkennung und den korrigierten opening_hours Wert",
                "SH,PH or PH,SH": "Dieser Wert unterscheidet sich insofern zum vorherigen als dass der Name für Schulferien den Namen von Feiertagen im Kommentar überschreibt, wenn sich diese überlagern",
                "config POIs": "POIs konfigurieren",
                "reload map": "Karte aktualisieren",
                "heading map": "Karte zur Auswertung des Tags opening_hours",
                "map is showing": '<a href="__mapUrl__">Ohne Filter</a> zeigt die Karte Knoten mit dem Tag <a rel="external" href="__wikiUrl__">opening_hours</a> als farbige Kreise:',
                "error": "Die Öffnungszeit konnte nicht ausgewertet werden",
                "warning": "Sollte eine Öffnungszeit beim verarbeiten eine Warnung erzeugen, wird im Status Icon ein blaues __sign__ angezeigt.",
                "map filter": "Es gibt mehrere Filter um nur die Öffnungszeiten von Interesse anzuzeigen. Die Hauptgründe für einen Filter sind Qualitätssicherung und das finden von offenen Geschäften. Hier die Liste der möglichen Filter:",
                "warnings only": "Nur Warnungen",
                "error only": "Nur Fehler",
                "data source": 'Die zugrundeliegenden Daten stammen von der __APIaTag__. Die Karte ist __OSMaTag__.',
                "mode 0": 'Es werden nur Zeiträume akzeptiert (Tags opening_hours, lit)',
                "mode 1": 'Es werden nur Zeitpunkte akzeptiert',
                "mode 2": 'Zeiträume und Zeitpunkte werden akzeptiert (Tags service_times, collection_times)',
            },
            "words": {
                "mode": "Auswerte Modus",
                "green": "Grün",
                "yellow": "Gelb",
                "red": "Rot",
                "violet": "Violett",
                "to": "-",
                "and": "und",
                "no": "kein",
                "his": "seine",
                "docu": "Dokumentation",
                "of course": "natürlich",
                "open": "geöffnet",
                "unknown": "unbekannt",
                "closed": "geschlossen",
                "comment": "Kommentar",
                "today": "heute",
                "tomorrow": "morgen",
                // "on weekday": "on", // not needed in this context
                "on weekday": " ",
                "region": "Region",
                "position": "Position",
                "lat": "Breitengrad",
                "lon": "Längengrad",
                "country": "Land",
                "state": "Bundesstaat",
                "status": "Status",
                "examples": "Beispiele",
                "none": "keine",
                "date": "Datum",
                "time": { // __count__ Can not cover need for Russian language (one, several, many).
                    "minute": "Minute",
                    "minute plural": "Minuten",
                    "minute many": "Minuten",
                    "hour": "Stunde",
                    "hour plural": "Stunden",
                    "hour many": "Stunden",
                    "day": "Tag",
                    "day plural": "Tage",
                    "day many": "Tage",
                    "hours minutes sep": "und ",
                    "now": "Jetzt",
                    "time": "Zeit",
                },
            },
        },
    },
    ru: { translation: {
            "lang": {
                "en": "английский",
                "de": "немецкий",
                "ru": "русский",
                "choose": "Выберите язык",
            },
            "months": {
                "short": {
                    "jan": "Янв",
                    "feb": "Фев",
                    "mar": "Мар",
                    "apr": "Апр",
                    "may": "Май",
                    "jun": "Июн",
                    "jul": "Июл",
                    "aug": "Авг",
                    "sep": "Сен",
                    "oct": "Окт",
                    "nov": "Ноя",
                    "dec": "Дек",
                },
                "full": {
                    "jan": "Января",
                    "feb": "Февраля",
                    "mar": "Марта",
                    "apr": "Апреля",
                    "may": "Мая",
                    "jun": "Июня",
                    "jul": "Июля",
                    "aug": "Августа",
                    "sep": "Сентября",
                    "oct": "Октября",
                    "nov": "Ноября",
                    "dec": "Декабря",
                },
            },
            "weekdays": {
                "short": {
                    "su": "Вс",
                    "mo": "Пн",
                    "tu": "Вт",
                    "we": "Ср",
                    "th": "Чт",
                    "fr": "Пт",
                    "sa": "Сб",
                },
                "full": {
                    "su": "воскресенье",
                    "mo": "понедельник",
                    "tu": "вторник",
                    "we": "среду",
                    "th": "четверг",
                    "fr": "пятницу",
                    "sa": "субботу",
                },
                "word next": {
                    "su": "ближайшее",
                    "mo": "ближайший",
                    "tu": "ближайший",
                    "we": "ближайшую",
                    "th": "ближайший",
                    "fr": "ближайшую",
                    "sa": "ближайшую",
                },
            },
            "texts": {
                "open always": "Заведение всегда открыто.",
                "closed always": "Заведение всегда закрыто.",
                "open now": "Сейчас заведение открыто",
                "closed now": "Сейчас заведение закрыто",
                "will close": "<a href=\"__href__\">Закроется</a> __timestring__.",
                "will open": "<a href=\"__href__\">Откроется</a> __timestring__.",
                "week stable": "Расписание верно для любой недели.",
                "not week stable": "ВНИМАНИЕ! Расписание меняется в другие недели.",
                "value for": "значение для",
                "MatchingRule": "использовать правила",
                "warn error": "об ошибках и предупреждения",
            },
            "words": {
                "to": "до",
                "and": "и",
                "no": "Нет",
                "open": "c",
                "unknown": "неизвестный",
                "closed": "закрыто",
                "comment": "комментариев",
                "today": "сегодня",
                "tomorrow": "завтра",
                "on weekday": "в ", // optionally in other languages
                "in duration": "через",
                "region": "регион",
                "position": "положение",
                "lat": "широта",
                "lon": "долгота",
                "country": "страна",
                "state": "штат",
                "status": "статус",
                "examples": "примеры",
                "date": "дата",
                "none": "никто",
                "time": {
                    "minute": "минуту",
                    "minute plural": "минуты",
                    "minute many": "минут",
                    "hour": "час",
                    "hour plural": "часа",
                    "hour many": "часов",
                    "day": "день",
                    "day plural": "дня",
                    "day many": "дней",
                    "now": "сейчас",
                    "time": "время",
                },
            },
        },
    },
};

function translatePage() { // Gets called when localization is loaded.
    // $(".lang").i18n();
    // $("headline").i18n();
}

function getUserSelectTranslateHTMLCode() {
    var res = i18n.t('lang.choose')
            + (i18n.lng() !== 'en' ? ' ('+ i18n.t('lang.choose', { lng: 'en' }) +')' : '' )
            + ': ';
    for (var lang in resources) {
        if (resources.hasOwnProperty(lang)) {
          res += '<button type="button" onclick="location.href=\'?setLng='
                + lang +'\'">' + i18n.t('lang.' + lang)
                + (i18n.lng() !== 'en' ? ' ('+ i18n.t('lang.' +lang, { lng: 'en' }) +')' : '' )
                + '</button>';
        }
    }
    return res;
}

i18n.init({
        fallbackLng: 'en',
        resStore: resources,
        getAsync: true,
        useCookie: true,
        debug: true
    }, translatePage);
// }}}
