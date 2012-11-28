GitHub Viewer
=============

[http://www.githubviewer.org/](http://www.githubviewer.org/)

An example application that connects to the GitHub REST API and displays
users from organizations.  Users can then be clicked to retrieve their
repositories.  Finally, a repository can be clicked and recent commits
displayed.

## Running locally ##

To run locally you will need to install [Node.js](http://nodejs.org) and
[grunt-bbb](http://github.com/backbone-boilerplate/grunt-bbb).  Once the
dependencies are installed, simply clone the repository and run the server.

``` bash
# Clone the repository.
git clone git://github.com/tbranyen/github-viewer.git

# Change directory into it.
cd github-viewer

# Run the server.
bbb server
```

## Stack ##

This is an entirely client-side application, meaning aside from the configured
HTTP server and the remote API, there is no server processing.  All logic is
isolated to JavaScript.

### Backbone Boilerplate ###

[backbone-boilerplate](https://github.com/tbranyen/backbone-boilerplate)

The foundation of the entire application structure and the deployment assets.
Along with [grunt-bbb](https://github.com/backbone-boilerplate/grunt-bbb) the
application can be tested locally and built for production with the same tool.

Some custom tweaks needed to be added for this to work:

* `production-fixes.css` file to map the Twitter Bootstrap images correctly.

### Backbone LayoutManager ###

[backbone.layoutmanager](https://github.com/tbranyen/backbone.layoutmanager)

Used for the general layout and View arrangement.  Is also used to facilitate
re-rendering and collection lists.  One single layout is created throughout
the lifespan of the application and instead the individual regions are updated.

### Backbone CollectionCache ###

[backbone.collectioncache.js](https://gist.github.com/2866702)

This is a *work-in-progress* Backbone plugin to provide a better caching
mechanism for Collections.  It's used within this application to provide
client-side caching in both sessionStorage (persist refresh) and inside memory
for faster lookups.

### Twitter Bootstrap ###

[bootstrap](https://github.com/twitter/bootstrap/)

Made the design look significantly better than the original.  Responsible for
the entire UI layer.

## Deployment ##

This is deployed on a Linode Arch Linux server that runs Nginx.  It is served
locally and updated via a `git pull` and `bbb release` combination.

The configuration looks like:

``` nginx
server {
  listen 80;
  server_name githubviewer.org;

  location / {
    root /github-viewer/;

    try_files $uri /index.html;
  }

  location /vendor/js/libs {
    alias /github-viewer/dist/release/;
  }

  location /app/styles {
    alias /github-viewer/dist/release/;
  }
}
```

## Credits ##

[@tbranyen](http://twitter.com/tbranyen)
