# Basic NGINX Deployment

This guide is mostly based on ubuntu so you may have to trace some directories. In general, not much should be different.

You will deploy on linux based servers about 99% of the time so the instructor recommends getting a VPS (I'm paying for about ~300/month in mine or get an old machine and install ubuntu there.

To know more about NGINX and reverse proxies in general, [read more here](/modules/react-deployment/reverse-proxy.md)

## NGINX: Create a new Site 

In the NGINX directory (`/etc/nginx` in ubuntu, your case may be different depending on how you installed it), change drive (cd) to `sites-available` and create a new file called `ervinne.com` (or the hostname of the site you will be hosting). And add the contents:

File `sites-enabled/ervinne.com`:

```conf
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/vhost/ervinne.com;

    index index.html;

    server_name ervinne.com;

    location / {
        try_files $uri $uri/ =404;
    }
    
    error_log /var/log/nginx/error.log;
}
```

This file tells NGINX several things:

- Deliver files from the folder `/var/www/vhost/ervinne.com`
- The main index page is called `index.html`.
- Requests that are requesting `ervinne.com` should be served by this server block.
- Test for the existence of a file in directory, otherwise, return 404.
- If there are any errors, write it in `/var/log/nginx/error.log`

## NGINX: Enabling a Site

Simply creating a symbolic link to the file from `sites-available` to `sites-enabled` will "enable" the site after a restart.

Enable the site we created earlier by:

```bash
# Guide: ls -s <source> <destination>

ln -s /etc/nginx/sites-available/ervinne.com /etc/nginx/sites-enabled/ervinne.com
```

Restart NGINX by:

```bash
service nginx restart
```

and changes should now apply.

## Handling Conflicts

You will likely encounter a conflict as there's already a default site in NGINX pointed to the same port (80).

Simply removing the symbolic link of the conflicting files will resolve this issue:

```bash
rm sites-enabled/default
```

WARNING! Remove `default` in `sites-enabled` and not in the `sites-available` as in `sites-available` is a real file and you won't be able to recover it anymore of you do delete it.

## Adding Development Hosts

If in case your domain is still propagating or you don't have a domain at all, you may modify your machine so that if it tries to access a domain, it will point to the IP of the server you're using.

__In windows (Windows 10 and Windows 8)__

1. Press the Windows key.
2. Type Notepad in the search field.
3. In the search results, right-click Notepad and select Run as administrator.
4. From Notepad, open the following file:

    `c:\Windows\System32\Drivers\etc\hosts`

5. Make the necessary changes to the file.
6. Select File > Save to save your changes.

    You do not need to restart the computer.


__In ubuntu__ 

1. Edit `/etc/hosts`
2. Add ip and host pair and save changes

    You do not need to restart the computer.

__In Mac (MacOS X 10.0 through 10.1.5)__

1. Open /Applications/Utilities/NetInfo Manager.
2. To enable editing of the Network Information database (NetInfo), click the padlock icon in the lower-left corner of the window.
3. Enter your domain user password and select OK.
4. In the second column of the browser view, select the node named machines.

5. In the third column, select the entry named localhost.
6. From the Edit menu, select Duplicate.

    A confirmation alert appears.

7. Click Duplicate.

    A new entry named localhost copy appears and its properties are displayed below the browser view.

8. Double-click the value of the ip_address property and enter the IP address of the other computer.
9. Double-click the value of the name property and enter the host name that you want use for the other computer.
10. Click the serves property and select Delete from the Edit menu.
11. From the File menu, select Save.

    A confirmation alert appears.

12. Click Update this copy.
13. Repeat steps 6 through 12 for each additional host entry that you want to add.
14. From the NetInfo Manager menu, select Quit.

    You do not need to restart the computer.
