/*
 * Helper to get hash from end of URL or generate a random one.
 * Completely cargo-culted from the Firepad demo.
 */
function getExampleRef() {
  var ref = new Firebase('https://firepad.firebaseio-demo.com');
  var hash = window.location.hash.replace(/#/g, '');
  if (hash) {
    ref = ref.child(hash);
  } else {
    ref = ref.push(); // generate unique location.
    window.location = window.location + '#' + ref.key(); // add it as a hash to the URL.
  }
  if (typeof console !== 'undefined')
    console.log('Firebase data: ', ref.toString());
  return ref;
}

/*
 * This function initializes Ace (and Firebase) but nothing else
 */
function init() {
  //// Initialize Firebase.

  var firepadRef = getExampleRef();

  // TODO: Replace above line with:
  // var firepadRef = new Firebase('<YOUR FIREBASE URL>');
  //// Create ACE
  window.editor = ace.edit("firepad-container");
  editor.setOptions(aceOptions);

  var session = editor.getSession();
  session.setUseWrapMode(true);
  session.setUseWorker(false);
  session.setMode("ace/mode/markdown");
  //// Create Firepad.
  if (typeof(firepadRef) !== 'undefined') {
    // This is so we can set the starting text in html. For Ace it works fine, but
    // for firepad we have to empty to editor and then initialize with defaultText.
    var startingText = editor.getValue();
    editor.setValue('');
    var firepad = Firepad.fromACE(firepadRef, editor, {
      defaultText: startingText
    });
    // When firepad loads, populate the preview.
    firepad.on('ready', sendNewContent)
  }
}

/*
 * This takes the text from the editor and turns it into the context object
 * that handlebars (or whatever) is going to need. It returns all the front
 * matter as JSON and the email body as HTML, all in one `context` object.
 *
 * This function will stay relevant even if we replace Ace/Firepad.
 */
function makeEmailContextFromText(theText) {
  textArray = theText.split('---');
  textArray.shift()
  emailYaml = textArray.shift();
  context = jsyaml.load(emailYaml);
  emailBody = textArray.join('---');
  context.body = marked(emailBody);
  //console.log(context);
  return context;
}

/*
 * This function will need to be updated if we switch away from Ace
 */
function getEmail() {
  return makeEmailContextFromText(editor.getValue());
}

/*
 * This function will need to be updated if we switch away from Handelbars
 */
function sendNewContent() {
  data = getEmail();
  html = template(data);
  $target.html(html);
}

/*
 * Get ready! stash a few vars that don't need to be recalculated each time,
 * set the change event handler, and focus on the editor.
 */
$(document).ready(function() {
  init(); // originally this was window.onload -- not sure why
  source = $("#email-preview-template").html();
  template = Handlebars.compile(source);
  $target = $('#email-preview-target');

  editor.on('change', sendNewContent );
  editor.focus();
});
