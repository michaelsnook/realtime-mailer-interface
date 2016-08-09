# realtime-mailer-interface
A front end for a realtime mailer editing interface using Markdown and YAML

### install

    git clone
    jekyll serve

### under the hood

Primarily this is a Jekyll site which embeds a Firepad, which is an Ace editor
wired up to do real-time collaborative editing. Your workspace is one big Ace
editor, to avoid all the complexity of actually building a real-time app.

You then write your activism email like you'd build a Jekyll page. YAML front-matter
plus markdown in the editor. Both get rendered in relatively real-time on the right with
some nice handy JavaScript libraries, and finally Handlebars.
