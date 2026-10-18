# ShipTracker

A simple page for tracking Hack Club projects, built with HTML, CSS, and JavaScript.

## Run

```sh
python3 -m http.server 4174 --bind 127.0.0.1
```

Open http://127.0.0.1:4174.

Use the form to add or edit a project. Each project has a name, program, status, notes, optional deadline, and optional link. Search or filter the list, mark projects as shipped, reopen them, or delete them after confirmation. The totals update automatically.

Projects are saved in this browser using localStorage. There are no accounts or cloud sync. Browser storage is separate for each browser and website address.

