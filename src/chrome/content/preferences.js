const CC = Components.classes;
VERB=1;
DBUG=2;
INFO=3;
NOTE=4;
WARN=5;

https_everywhere = CC["@eff.org/https-everywhere;1"].getService(Components.interfaces.nsISupports).wrappedJSObject;

const id_prefix = "he_enable";
function https_settings_changed(doc)
// The user changed one of the preferences, so make the rulesets sync to them
// This is not efficient but it doesn't matter
{
  var rs = doc.getElementById('https_everywhere_RuleSetList');
  var rulesets = https_everywhere.https_rules.rules;
  for (var i = 0; i < rulesets.length; i++) {
    var ruleset = rulesets[i];
    var elem = doc.getElementById(id_prefix + ruleset.name);
    ruleset.active = elem.checked;
  }
}

const row_width = 5;
function https_prefs_init(doc) {
  var o_httpsprefs = https_everywhere.get_prefs();

  var rs = doc.getElementById('https_everywhere_RuleSetList');
  var rulesets = https_everywhere.https_rules.rules;
  var hbox;
  for (var i = 0; i < rulesets.length; i++) {
    var ruleset = rulesets[i];

    if (i % row_width == 0) {
      hbox = doc.createElement("hbox");
      rs.insertBefore(hbox,null);
    }

    var newopt = doc.createElement("checkbox");
    // This pref should always have been created by the RuleSet constructor
    var enabled = o_httpsprefs.getBoolPref(ruleset.name);
    newopt.setAttribute("id", id_prefix + ruleset.name);
    newopt.setAttribute("label",ruleset.name);
    newopt.setAttribute("preference",null);
    newopt.setAttribute("checked", enabled);
    newopt.setAttribute("oncommand", 
                        "https_settings_changed(document)");
    hbox.insertBefore(newopt,null);
  }
  // Do this here rather than in the .xul so that it goes after all these
  // postpendments
  var spacer=doc.createElement("separator");
  spacer.setAttribute("class", "groove");
  rs.insertBefore(spacer,null);
}

function https_prefs_cancel(doc) {
  // the user changed some prefs but then cancelled; undo the consequences
  var o_httpsprefs = https_everywhere.get_prefs();
  var rulesets = https_everywhere.https_rules.rules;
  for (var i = 0; i < rulesets.length; i++) {
    var ruleset = rulesets[i];
    ruleset.active = o_httpsprefs.getBoolPref(ruleset.name);
  }
}


function https_prefs_save(doc) {
  var o_httpsprefs = https_everywhere.get_prefs();
  var rs = doc.getElementById('https_everywhere_RuleSetList');
  var rulesets = https_everywhere.https_rules.rules;
  for (var i = 0; i < rulesets.length; i++) {
    var ruleset = rulesets[i];
    var elem = doc.getElementById(id_prefix + ruleset.name);
    o_httpsprefs.setBoolPref(ruleset.name, elem.checked);
  }
}

function https_enable_all(doc) {
  // "restore defaults" / enable all rules
  var o_httpsprefs = https_everywhere.get_prefs();
  var rulesets = https_everywhere.https_rules.rules;
  var rs = doc.getElementById('https_everywhere_RuleSetList');
  for (var i = 0; i < rulesets.length; i++) {
    var ruleset = rulesets[i];
    ruleset.active = true;
    var elem = doc.getElementById(id_prefix + ruleset.name);
    elem.checked = true;
  }
}
