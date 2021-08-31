---
layout: post
title:	"Netdata tutorial for Production Web Server (Nginx, PHP-fpm, MariaDB)"
date:	2020-03-30
author: "Odysseas Lamtzidis"
# category:
#     - blog
tags:
    - "2020"
    - tutorial
    - technology
    - netdata
excerpt: "A complete guide on how to install and configure Netdata for a production server for a typical PHP webserver (Nginx, php, MariaDB)"
image: https://pbs.twimg.com/profile_images/1146809342013988864/T0ULmki3_400x400.png
vertical: devops
---
Created: Dec 05, 2019 | Updated: Jan 12, 2020 | Document Version: 0.3
<br>
<br>
# Why 

A while back I discovered [Netdata](https://netdata.cloud) and I was truly fascinated by it's take on system monitoring for two main reasons. It was extremely lightweight, something of great usefulness to me, an IoT enthusiast, as it proved to be a  very useful tool to debug IoT devices, such as the Raspberry pi. 

On a Raspberry pi zero W, it consumes as little as 10% of the cpu, without any optimization whatsoever and update frequency of 1 second. **Crazy huh?**

Another aspect that I enjoyed as a newcomer to the world of *Devops* was the intrinsic easiness of both the installation and customization of the platform. It's truly a *fire and forget* application that is configured and programmed in such as way that the default settings will be adequate for a large number of users, myself included. 

This fascination and the fact that I had just finished my Integrated Master's diploma ,(thus looking to break into the startup world), led me to contribute a bit of docs and code, as a good open source citizen. 

Wanting to dig further, I was extremely fortunate to be introduced to a sys-admin at the University of Patras, named Spiros. Spiros and I, installed and configured Netdata on a production server for the University of Patras. This post is an attempt to distill what we learned.

*This post describes how to install and configure Netdata for a production server for a typical PHP webserver (Nginx, php, MariaDB).*

**It was originally written back in January, but it is published now for the first time.**

# Introduction

This post is intended for the purpose of onboarding a production web-server to the Netdata platform, introducing a new era to metrics and performance monitoring. Netdata is built around 4 main principles:

- **Per second** data collection for all metrics.
- Collection & Visualization of metrics from **all possible** sources
- Meaningful presentation of metrics, optimised for visual anomaly detection
- **Pre-configured**, fire (install) and forget!

> Netdata decentralizes monitoring completely. Each Netdata node is autonomous. It collects metrics locally, it stores them locally, it runs checks against them to trigger alarms locally, and provides an API for the dashboards to visualize them. **Horizontal Scale**

### So what Netdata does?

1. Metrics are auto-detected, so for 99% of the cases data collection works out of the box.
2. Metrics are converted to human readable units, right after data collection, before storing them into the database.
3. Metrics are structured, organized in charts, families and applications, so that they can be browsed.
4. Dashboards are automatically generated, so all metrics are available for exploration immediately after installation.
5. Dashboards are not just visualizing metrics; they are a tool, optimized for visual anomaly detection.
6. Hundreds of pre-configured alarm templates are automatically attached to collected metrics.

![Netdata%20guide%20for%20Production%20Web%20Server%20Nginx%20PHP%20/Untitled.png](https://i.imgur.com/hcoIwoB.png)

### How netdata collectors work:

Netdata uses internal and external plugins to collect data. Internal plugins run within the Netdata daemon, while external plugins are independent processes that send metrics to Netdata over pipes. There are also plugin orchestrators, which are external plugins with one or more data collection modules.

## Requirements for the use-case

- **History:**
    - Period: 1 year
    - Granularity: (average)5min
    - Data points: cpu, net traffic, ram (system-wide, per application)
- **System:** Ubuntu 18.04.3 LTS
- **VM:** Yes
- **Applications:**
    - Ngingx
    - phpfm
    - drupal
    - mariaDB (mysql, innodb style)
- **Alarms:**
    - Critical: downtime (uptime monitor)
    - Normal: uptime monitor, unusual senarios (e.g 70% cpu. 99% i/o filesystem)
    - Medium: email
- **Setup:**
    - Local registry
    - 2 linux VMs webserver, one for upatras.gr, one for various minor sites
    - situated in the same secure network, no need for vpn or authentication

# Installation

In this section we go through the installation of the netdata platform and all the required libaries, packages and third party programs that will enable the monitoring according to the requirements.

This installation will be replicated to both the machines that will host a web-server, one will work as a slave that will forward metrics to the main machine where all the processing and storage will be conducted. It is explained in the **Streaming section.**

## Netdata

There are multiple ways to install netdata, but the user is advised to use the one-line script that is provided by netdata. According to the requirements, this is the optimal route.

With the one-liner below, you install netdata and all the dependencies. You also agree that Netdata will aggregate anonymous statistics (such as OS version) that is necessary for rapid product development and discovery (prioritize OS binaries, decide features etc.)

```bash
bash <(curl -Ss [https://my-netdata.io/kickstart.sh](https://my-netdata.io/kickstart.sh)) --no-updates --stable-channel
```

**comments:**

no-updates: Prevent automatic updates of any kind.

stable-channel: Automatically update only on the release of new major versions (thus install latest stable release)

To inspect the installation url, the use can download it from [here](https://my-netdata.io/kickstart.sh).

Now that Netdata is (hopefully) installed, please head over to [http://localhost:19999](http://localhost:19999) to verify correct installation.

## Firewall issues

If you can't connect, it's possible that you have a firewall installed and that you have to open the port `19999`.  Below you can find relevant information and commands for Ubuntu & CentOS.

**Ubuntu:**

```bash
sudo ufw allow 19999/tcp
```

**CentOS:**

```bash
firewall-cmd --permanent --add-port 19999/tcp
```
Don't forget to enable the netdata service using `sudo systemctl enable netdata`

**All Installation methods:** [https://docs.netdata.cloud/packaging/installer/](https://docs.netdata.cloud/packaging/installer/)

## Installation using Package Manager

In a production environment, it is a good practice to use the Package Manager to install Netdata. Please do so by using the Package Manager of the distribution. 

Before Installing Netdata from the Package Manager, we need to add the Netdata Repository from [PackageCloud](https://packagecloud.io/netdata/netdata) into the *system package sources*.

Run the following code to add the Repository into your *system's package sources*:

```bash
curl -s https://packagecloud.io/install/repositories/netdata/netdata/script.deb.sh | sudo bash
```

Now we can install netdata (e.g using `apt-get install` in Ubuntu):
```bash
sudo apt-get install update
sudo apt-get install upgrade
sudo apt-get install netdata
```
## Nginx Proxy - Security Alert

For increased security, it is advised that you configure Netdata to be only accessible from [localhost](http://localhost) and *proxy* the connection through an NginX Reverse Proxy server. Please follow the [guide](Python3) to set up the reverse proxy.

## Necessary Libraries

As per the uproduction web-server scenario requirements, we need to install some external libraries in order for the plugins that enable the data collection (collectors) can be used by netdata.

Although netdata supports plugins from 4 different ecosystems (Bash, Python, NodeJS, Golang), we will be using **Python Plugins** as they cover our needs and are the most battle-tested.

**News Bullet:**  Netdata is gradually implementing all the python add-ons to Golang, as Golang offers better performance (**which is critical to minimise netdata's footprint**). Although Python plugins will still function as expected, after the transition, new versions of the plugins (e.g with more metrics) will likely  appear as Go plugins.

### Update/Install either Python 2.7+ or Python 3.1+

To test currently installed python version:
```bash
#python 2
python -V
```
```bash
#python 3 
python3 -V
```
# Important Note on Python Version

Currently, Netdata uses the system's default python version. Thus, for **most systems (e.g Ubuntu), Netdata will use Python2.7.** If python2.7 is the default one for your system, please install all the libraries for Python2.7.

All systems have a certain Python version already pre-installed. It is advised to use that one for the rest of the tutorial and not install a new one.

### Install PiP (Python Package Manager)

Before proceeding, we will install PIP, a **necessary** Package Manager for all Python libraries.

Depending on the python version that we will be using, install PIP using the Package Manager of the distribution.

**Python2:**
```bash
sudo apt install python-pip
pip install --upgrade pip #update pip to latest version
```
**Python3:**
```bash
sudo apt install python3-pip
pip install --upgrade pip #update pip to latest version
```
### Install Collector Libraries:

**MariaDB(Mysql):**

To monitor the MariaDB server, we will be needing the *python library* `python-mysqldb`. Please follow the instructions bellow to install the package **system-wide.**

It is worth mentioning that depending on your setup, it is possible that you will be needing to use `sudo pip`. In that case, please use the -H flag as follows: `sudo -H`. It is needed to force pip to install the package to the system's home directory, thus making the package available system-wide. 

#### Ubuntu

Depending on whether you use Python2 or Python3, the installation of the required packages and libraries is different. The packages are required so that the Python Library that interfaces with MariaDB can function properly.

**Python2**
```bash
sudo apt-get install default-libmysqlclient-dev
sudo apt-get install python-dev 
pip install mysqlclient 
```
**Python3**
```bash
sudo apt-get install default-libmysqlclient-dev
sudo apt-get install python3-dev 
pip3 install mysqlclient
```

#### CentOS

**Python3**
```bash
yum install mariadb-devel
pip3 install mysqlclient
```
**Python2**
```bash
yum install mariadb-devel
pip install mysqlclient 
```
**Github page:** [https://github.com/PyMySQL/mysqlclient-python](https://github.com/PyMySQL/mysqlclient-python)

**Docs:** [https://mysqlclient.readthedocs.io/](https://mysqlclient.readthedocs.io/)

# Netdata Configuration

Now that everything is installed, you can restart netdata by running `sudo systemctl restart netdata`and head over to the dashboard `http:<netdata_host_ip>:19999`. Netdata automatically detects data sources and enable plugins.

## General Configuration

The configuration of the netdata agent is conducted through a helper script which is found at:

`/etc/netdata/edit-config`. It is possible that `sudo` is needed to use the script as the script fetches the default configuration, opens it for the user to edit and then saves it in `/etc/netdata`.

The main configuration file is named: **netdata.conf**.

The `netdata.conf` file is broken up into various sections, such as [global], [web], [registry], and more. By default, most options are commented, so you’ll have to uncomment them (remove the #) and restart netdata for Netdata to recognise your change.

**We will be leaving the configuration at default for an initial testing period**, before we proceed to any modifications to address specific needs. Bellow, the user can find all relevant documentation for easy access.

One metrics we do need to change, is the storage capacity of the **dbengine,** which is the default saving mechanism and our choice as per the requirements.

Note that there are **several options** regarding the **mechanism** with which netdata will **save data,** including the dbengine and a Round-Robin in-memory only database. For more information: https://docs.netdata.cloud/database

## Collectors (Data Collection)

Netdata supports **internal** and **external** data collection plugins:

- **internal** plugins are written in `C` and run as threads inside the `netdata` daemon.
- **external** plugins may be written in any computer language and are spawn as independent long-running processes by the `netdata` daemon. They communicate with the `netdata` daemon via `pipes` (`stdout` communication).

To minimize the number of processes spawn for data collection, Netdata also supports **plugin orchestrators**.

- **plugin orchestrators** are external plugins that do not collect any data by themeselves. Instead they support data collection **modules** written in the language of the orchestrator. Usually the orchestrator provides a higher level abstraction, making it ideal for writing new data collection modules with the minimum of code.

    Currently Netdata provides plugin orchestrators BASH v4+ [charts.d.plugin](https://docs.netdata.cloud/collectors/charts.d.plugin/), node.js [node.d.plugin](https://docs.netdata.cloud/collectors/node.d.plugin/) and python v2+ (including v3) [python.d.plugin](https://docs.netdata.cloud/collectors/python.d.plugin/).

We will be using the Python plugin orchestrator, each of the collectors states below is in essence a module of the Python.d plugin.

### General Information

When Netdata starts, it auto-detects dozens of data sources, such as database servers, web servers, and more. To auto-detect and collect metrics from a service or application you just installed, you need to restart Netdata. 

**Download and install all the software that you want to monitor (in our case: nginx, PHP-fmp, MariaDB) prior to the netdata installation, to leverage automatic discovery)** 

We can configure both internal and external plugins, along with the individual modules. 

- In `netdata.conf`, `[plugins]` section: Enable or disable internal or external plugins with `yes` or `no`.
- In `netdata.conf`, `[plugin:XXX]` sections: Each plugin has a section for changing collection frequency or passing options to the plugin.
- In `.conf` files for each external plugin: Enable/Disable specific modules or set plugin specific configurations. For example, at `/etc/netdata/python.d.conf`.
- In `.conf` files for each module. Set module specific configurations, such as the metrics endpoint. : For example, at `/etc/netdata/python.d/nginx.conf`.

We will be leaving the configurations at default for the testing period. In case you have installed an application with non-standard settings (e.g different socket location) please do make the proper change in the appropriate `.conf` file. Otherwise, no configuration is needed (unless explicitly stated in this guide).

```bash
#Example
sudo /etc/netdata/edit-config python.d/nginx.conf
```

### Chosen Collectors:

As per the requirements of production web-server, the following plugins were chosen:

- **web_log:** Parses the log files of known servers (e.g nginx) and detects irregularities
- **mysql:** connects to a mysql database and fetches various metrics
- **php-FPM:** Uses the /metrics endpoint of a PHP-FPM powered server and fetches metrics
- **nginx:** Uses the metrics endpoint( socket, HTTP endpoint) and fetches metrics

### Notes on editing the configuration files:

Python plugins use YAML files to be configured, and one of the most important common configurable variable, is the resource address that each plugin will reach to gather statistics.

To facilitate configuration, most Netdata plugins have already pre-configured a number of possible endpoints for each plugin. For example, `mysql` searches on multiple directories for the right  `Unix socket` It does so by defining different `jobs`, each `job` for one endpoint . 

Note that if two or more jobs have the same `name`, only one will run. Meaning that **the plugin will use the endpoint for which it's job was the first one to succeed in retrieving information.**

Thus, when configuring the plugins, **you can edit only one job to point it to the right direction** (for example, if you have changed the default directory for the `nginx_status_page`. 

It is also advised to change the name of *all* the jobs to the desired name (that will be used by the dashboard) so that you don't have to find out specifically which job is the one that is activated by the plugin.

📍  **web_log**

Parses the log file of various web servers (nginx, apache, gunicord, etc.) to detect the following scenarios:

- too many redirects
- too many bad requests
- too many internal server errors
- unreasonably too many requests

- unreasonably few requests
- unreasonably slow responses
- too few successful responses

🔧 Edit the configuration file to point the collector to the correct **weblog metrics endpoint (** the logs of your web server e.g apache, nginx, etc. )**.**

```bash
sudo /etc/netdata/edit-config python.d/web_log.conf
```
Make sure that web_server logs and the relevant directory is accessible by the user `netdata`

📃 *docs page:* [https://docs.netdata.cloud/collectors/python.d.plugin/web_log/](https://docs.netdata.cloud/collectors/python.d.plugin/web_log/)

📍  **mysql**

It monitors one or many mysql servers. To function as intended it requires a python library (as mentioned above) and a **netdata user** to access the database and gather metrics.

To create the `netdata` user, execute the following in the MySQL shell:

```sql
create user 'netdata'@'localhost';
grant usage on *.* to 'netdata'@'localhost';
flush privileges;
```

🔧 Edit the configuration file to point the collector to the correct **mysql metrics endpoint.**

> 📍Please note that the default settings probably already cover your use-case.

```bash
sudo /etc/netdata/edit-config python.d/mysql.conf
```

📃 *docs page:* [https://docs.netdata.cloud/collectors/python.d.plugin/mysql/](https://docs.netdata.cloud/collectors/python.d.plugin/mysql/)

📍  **PHP-FPM:**

This module will monitor one or more php-fpm instances depending on configuration.

🔧 Edit the configuration file to point the collector to the correct **PHP-FPM metrics endpoint.** 

```bash
sudo /etc/netdata/edit-config python.d/phpfpm.conf
```

📃*docs page:* [https://docs.netdata.cloud/collectors/python.d.plugin/phpfpm/](https://docs.netdata.cloud/collectors/python.d.plugin/phpfpm/)

📍 **nginx:**

This module will monitor one or more nginx servers depending on configuration. Servers can be either local or remote.

🔧 Edit the configuration file to point the collector to the correct **nginx metrics endpoint.**

```bash
sudo /etc/netdata/edit-config python.d/nginx.conf
```

📃*docs page:* [https://docs.netdata.cloud/collectors/python.d.plugin/nginx/](https://docs.netdata.cloud/collectors/python.d.plugin/nginx/)

**httpcheck:**

Module monitors remote http server for availability and response time.

The user must edit the `.conf` file to point it to the web server's location.  You can use regex expression, as stated in the configuration file, in order for the plugin to **search a specific string** in the website. 

This is handful in case the PHP server has crashed, so nginx does not return the proper website, but rather the nginx home screen. HTTP (200) is returned either way, meaning that httpcheck *without* regex can't tell the difference.

```bash
sudo /etc/netdata/edit-config python.d/httpcheck.conf
```

📃*docs page:* [https://docs.netdata.cloud/collectors/python.d.plugin/httpcheck/](https://docs.netdata.cloud/collectors/python.d.plugin/httpcheck/)

---

### DB engine

DB engine is the custom database implemented and used by netdata. It stores most recent data in-memory and "spills" historical data into the disk, compressing them to increase storage performance even further.  Notably, it is optimised for HDDs, offering performance that is acceptable versus the more efficient SSDs.

The configuration variables that are of interest to us are the following:

```
[global]
    page cache size = 32
    dbengine disk space = 256
```
`page cache size` sets the maximum amount of RAM (in MiB) the database engine will use for caching and indexing. `dbengine disk space` sets the maximum disk space (again, in MiB) the database engine will use for storing compressed metrics.

These default settings will retain about **a day’s worth** of metrics when Netdata collects roughly **4,000 metrics every second.** If you increase either `page cache size` or `dbengine disk space`, Netdata will retain even more historical metrics.

The use-case of production web-server involves roughly 2,000 metrics per second, thus the default settings will save 2 days worth of data. **For a retention period of 1 week, the following settings are advised.**

When using the dbengine, the `history` configuration variable is irrelevant, please ignore it.
```
[global]
    page cache size = 32
    dbengine disk space = 1024 
```
Note that **both fields affect the memory footprint** of the `dbengine` and as a result netdata in general. For the specific use-case tests were conducted and was decided that the change in memory consumption **is not noteworthy**. For more info: https://docs.netdata.cloud/database/engine/#memory-requirements

🙏  *With the database engine active, you can back up your /var/cache/netdata/dbengine/ folder to another location for redundancy.*

**dbengine docs:** [https://docs.netdata.cloud/database/engine](https://docs.netdata.cloud/database/engine)

**dbengine & history retention period:** [https://docs.netdata.cloud/docs/tutorials/longer-metrics-storage/](https://docs.netdata.cloud/docs/tutorials/longer-metrics-storage/)

---

## Health & Alarms

Each Netdata node runs an independent thread evaluating health monitoring checks. This thread has lock free access to the database, so that it can operate as a watchdog.

Netdata also supports alarm **templates**, so that an alarm can be attached to all the charts of the same context (i.e. all network interfaces, or all disks, or all mysql servers, etc.).

Each alarm can execute a single query to the database using statistical algorithms against past data, but alarms can be combined. So, if you need 2 queries in the database, you can combine 2 alarms together (both will run a query to the database, and the results can be combined).

For the given use case, we will be using the stock alarms as they cover all the scenarios. The user is advised to adjust the alarms in the future for more fine-grained controls.

To edit the configuration files for the alarms of each plugin, we will use the `edit-config` command, like this:
```bash
# Example for editing the alarms of the httpcheck plugin
sudo /etc/netdata/edit-config health.d/httpcheck.conf
 ```
To get an easy overview over the active alarms, head over to the **dashboard** and click on the **Alarms section** at the top. After clicking the category **all**, you can overview the activated alarms, their configuration and an apt description.

### Notifications

An important aspect of the alarms component is the notification functionality. Netdata is able to inform the user on important events, via multiple mediums, from e-mail to discord integration.

To configure the alarming configuration (such as email recipient, etc.) we edit the following configuration file:
```bash
sudo /etc/netdata/edit-config health_alarm_notify.conf
```
Since we will be using  `Email`, we only edit the following variables inside the configuration file, moreover if we want to enable the notifications **ONLY** for critical alarms, please follow the mentioned structure:
```
DEFAULT_RECIPIENT_EMAIL="YOUR_EMAIL"
# to receive only critical alarms, set it to "YOUR_EMAIL|critical"
```
### Email Configuration

To configure email with netdata, the user needs to configure a terminal email client. `sendemail` is advised as is one of the most common clients and also the default choice for netdata.

**To configure please follow the instructions:** [https://dbaron.org/linux/sendmail](https://dbaron.org/linux/sendmail)

For more information on the syntax of the alarms (in order to fine tune the alarm criteria or add new alarms), please visit the health.d docs and the badges doc (they use same structure).

**Health.d:** [https://docs.netdata.cloud/health/](https://docs.netdata.cloud/health/)

**Badges:** [https://docs.netdata.cloud/web/api/badges/](https://docs.netdata.cloud/web/api/badges/)

## Streaming

Each Netdata is able to replicate/mirror its database to another Netdata, by streaming collected metrics, in real-time to it. This is quite different to data archiving to third party time-series databases.

When Netdata streams metrics to another Netdata, the receiving one is able to perform everything a Netdata instance is capable of:

- visualize them with a dashboard
- run health checks that trigger alarms and send alarm notifications
- archive metrics to a backend time-series database

Per the requirements, we will be using a **slave-master setup**, where a node will behave as the master node and gateway to the system, while each slave will only serve as aggregator of data. 

**In essence the Master Netdata node will have 2 databases from which it will draw charts and raise alarms.** 

1. The first database is from the machine where the master node is installed
2. The second database is from the machine where the slave node is installed

### Master Node

When setting up the Master Node, we will be configuring settings for API_KEYS and not for distinct slaves, meaning that master node will treat each slave that is configured with an identical API_KEY, the same.

Depending on the use case, we might want to have different settings for different slave machines (e.g different history retention policy). We generate `N API_KEYS` for `N` distinct `slave groups`. All the `slaves` that belong to the same `slave group` will be treated the same by the `Master Node`.

To generate `N API_KEYS`, we run N times the command: `uuidgen`. In our case, we generate only one (1) `API_KEY`.

Now it is time to setup the **Master Node**:

1. Setup netdata (without installing any extra libraries, as Netdata Master will only monitor the system and itself, serving as the central hub of the metrics from all the slaves).
    1. Note that the Master Node will have extra requirements in RAM and disk storage as it will retain 2 databases for the slaves (2000 metrics/s) and 1 database for  the Master (1500 metrics/s), for one week. 
    2. For more information on the DBengine's requirements, please read [here](https://github.com/netdata/netdata/blob/master/docs/tutorials/longer-metrics-storage.md) and [here](https://docs.netdata.cloud/database/engine/).
2. edit `stream.conf` and set `[stream].enabled: yes`
    1. `sudo /etc/netdata/edit-config stream.conf`
    2. The `API_KEY` mentioned bellow is the `API_KEY` we generated using `uuidgen`.
```
[API_KEY] 
    enabled = yes
    default history = 3600
    default memory mode = dbengine
    health enabled by default = auto
    allow from = *
```
3. For the initial testing period we won't be editing anything else. You can return later to customise it according to your specific needs.
4. Since both the machines belong to the same secured network, we won't be needing authentication and TLS support.

You can find in-detail explanation of all the available configuration options for the streaming functionality in the docs.

📃*docs:* [https://docs.netdata.cloud/streaming/](https://docs.netdata.cloud/streaming/)

### Slave Node

**The setup of each slave Node is identical:**

1. Setup netdata and the required libraries according to the guide above
    1. When setting up the dbengine, use the default settings that will allow close to 2 days word of data to be stored in the slave for redundancy.
2. edit `stream.conf`
    1. Use the `API_KEY` that was generated in the Master Slave phase.
    2.  `sudo /etc/netdata/stream.conf`
```
[stream]
    enabled = yes 
    destination = IP:PORT #Master
    api key = API_KEY #generated in step (1)
```
Now each slave node is configured to stream the entirety of the metrics that it collects to the master node.

## Registry

Using Netdata, your monitoring infrastructure is embedded on each server, limiting significantly the need of additional resources. Netdata is blazingly fast, very resource efficient and utilizes server resources that already exist and are spare (on each server). This allows **scaling out** the monitoring infrastructure.

However, the Netdata approach introduces a few new issues that need to be addressed, one being **the list of Netdata we have installed**, i.e. the URLs our Netdata servers are listening.

To solve this, Netdata utilizes a **central registry**. This registry, together with certain browser features, allow Netdata to provide unified cross-server dashboards.

**The registry keeps track of 4 entities:**

1. **machines**: i.e. the Netdata installations (a random GUID generated by each Netdata the first time it starts; we call this **machine_guid**)

    For each Netdata installation (each `machine_guid`) the registry keeps track of the different URLs it is accessed.

2. **persons**: i.e. the web browsers accessing the Netdata installations (a random GUID generated by the registry the first time it sees a new web browser; we call this **person_guid**)

    For each person, the registry keeps track of the Netdata installations it has accessed and their URLs.

3. **URLs** of Netdata installations (as seen by the web browsers)

    For each URL, the registry keeps the URL and nothing more. Each URL is linked to *persons* and *machines*. 

4. **accounts**: i.e. the information used to sign-in via one of the available sign-in methods. Depending on the method, this may include an email, an email and a profile picture. **Only applicable via cloud log-in.**

**Local Registry**

For security purposes and per the production web-server requirements, we will be establishing an agent node as a local registry and then configure all the netdata nodes to advertise themselves to that registry. This way, the user will be able to access the local registry and easily navigate towards all the available netdata instances.

🔧 To turn any Netdata into a registry, edit `/etc/netdata/netdata.conf` and set:

```
[registry]
    enabled = yes
    registry to announce = http://<netdata_host_ip>:19999
    registry hostname = Master node #hostname used only in the registry
```
And now set the other netdata instances to advertise to that registry, edit again `/etc/netdata/netdata.conf` :
```
[registry]
    enabled = no
    registry to announce = http://<netdata_host_ip>:19999
        registry hostname = Slave node #hostname used only in the registry
```
No additional configuration is required. Restart netdata and head over to the Dashboard to evaluate setup.

📃*docs:* [https://docs.netdata.cloud/registry/](https://docs.netdata.cloud/registry/)

## Backends (Long-term Storage)

Up until this point, netdata has been setup to save data for 1 week in the Master Node and for 1 day in the slave Node.

Remember that the slave's database is been replicated to the Master Node, with retention period of 1 week.

To enable long-term historic data we will be using the backends functionality of netdata. According to the requirements, we will be using Prometheus to grab data from the Master Node and save it in a time-series long term database.

In essence, we will point **Prometheus** to **netdata** in order to fetch data and **Grafana** to **Prometheus** in order to visualize them.

We will set the Prometheus sampling at 3m, since for historic data 1s accuracy is not required.

### Prometheus Installation

We will be installing Prometheus on the machine where the Netdata Master Node runs.

To install Prometheus run the following commands:
```bash
cd /tmp && curl -s https://api.github.com/repos/prometheus/prometheus/releases/latest \
| grep "browser_download_url.*linux-amd64.tar.gz" \
| cut -d '"' -f 4 \
| wget -qi -

# create Prometheus user
sudo useradd -r prometheus

# create prometheus directory
sudo mkdir /opt/prometheus
sudo chown prometheus:prometheus /opt/prometheus

# Untar prometheus directory
sudo tar -xvf /tmp/prometheus-*linux-amd64.tar.gz -C /opt/prometheus --strip=1
```
### Prometheus Configuration

Prometheus is setup using `.yaml` .

1. run `touch prometheus.yaml`
2. `sudo nano prometheus.yaml`
3. Copy the following configuration, replace NETDATA_IP with localhost:

```yaml
    # my global config
    global:
      scrape_interval:     3m # Set the scrape interval to every 5 seconds. Default is every 1 minute.
      evaluation_interval: 5s # Evaluate rules every 5 seconds. The default is every 1 minute.
      # scrape_timeout is set to the global default (10s).
    
      # Attach these labels to any time series or alerts when communicating with
      # external systems (federation, remote storage, Alertmanager).
      external_labels:
          monitor: 'codelab-monitor'
    
    # Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
    rule_files:
      # - "first.rules"
      # - "second.rules"
    
    # A scrape configuration containing exactly one endpoint to scrape:
    # Here it's Prometheus itself.
    scrape_configs:
      # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
      - job_name: 'prometheus'
    
        # metrics_path defaults to '/metrics'
        # scheme defaults to 'http'.
    
        static_configs:
          - targets: ['0.0.0.0:9090']
    
      - job_name: 'netdata-scrape'
    
        metrics_path: '/api/v1/allmetrics'
        params:
          # format: prometheus | prometheus_all_hosts
          # You can use `prometheus_all_hosts` if you want Prometheus to set the `instance` to your hostname instead of IP 
          format: [prometheus_all_hosts] #stream both Master & Slave node
          #
          # sources: as-collected | raw | average | sum | volume
          # default is: average
          #source: [as-collected]
          #
          # server name for this prometheus - the default is the client IP
          # for Netdata to uniquely identify it
          #server: ['prometheus1']
        honor_labels: true
    
        static_configs:
          - targets: ['<netdata_host_ip>:19999']
```
**Some notes on the configuration :**

1. We set the source as `average` which is the default setting. It means that Prometheus will store the average value of each interval (3m). If we set `as-collected`, we would be saving the exact value of each metric every 3 minutes.
2. **Prometheus_all_hosts:** It facilitates storage & retrieval, since each metric is saved with a prefix depending on the host_machine from where it originated (remember, we have 2 machines).
3. Prometheus needs only to point to the Master Node. Master Node will export both it's databases.
4. For all intents and purposes, we will be using the default settings for Prometheus

### Test Prometheus

👉👉👉👉 Go to `[http://localhost:9090](http://localhost:9090)` to verify that everything is working.

Please don't forget to verify that the system's firewall allows prometheus to be accessed from the web. For more information, please refer back to the [Firewall Section](https://www.notion.so/odyslamtzidis/Netdata-guide-for-Production-Web-Server-Nginx-PHP-fpm-MariaDB-f17397f9c8524765bb06adec59aa2087#8bf84260bb0c47e8bdb17f5b006e097d)

You can read more in detail on how to setup Prometheus for more customised options at the docs:

📃 [https://prometheus.io/docs/prometheus/latest/getting_started/](https://prometheus.io/docs/prometheus/latest/getting_started/)

### Prometheus Service

Finally, it's needed to create and install prometheus as a service. Follow the commands:
```bash
sudo touch /etc/systemd/system/prometheus.service
sudo nano /etc/systemd/system/prometheus.service
```
and paste the following text inside the service file:
```
[Unit]
Description=Prometheus Server
AssertPathExists=/opt/prometheus

[Service]
Type=simple
WorkingDirectory=/opt/prometheus
User=prometheus
Group=prometheus
ExecStart=/opt/prometheus/prometheus --config.file=/opt/prometheus/prometheus.yml --log.level=info
ExecReload=/bin/kill -SIGHUP $MAINPID
ExecStop=/bin/kill -SIGINT $MAINPID

[Install]
WantedBy=multi-user.target
```
Finally
```bash
sudo systemctl start prometheus
sudo systemctl enable prometheus
```
### Prometheus and High-Availability

At this point, it is important to make a succinct note on Prometheus as a production-ready Long-Term Storage solution. In reality Prometheus is not intended to be used for long-term archiving, despite it's efficiency (1.3 bytes/sample)  because it does not support High-Availability and Fault-Tolerance capabilities out of the box.

It is recommended for the user to research the following Open-Source projects that are placed *on top of Prometheus* and provide such functionality:

- **Thanos**: [Thanos](https://thanos.io/)

- **Cortex**: [Cortex](https://github.com/cortexproject)

- **M3**: [m3db/m3](https://github.com/m3db/m3/)

---

### Grafana

**Installation**

The installation of Grafana is more straight forward, per the use-case and for easy management, the use of docker containers is advised.

**Install docker:**

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
sudo apt install docker-ce
```
**Run Grafana container:**
```bash
docker run -i -p 3000:3000  grafana/grafana
```
Note that using the above command, we run Grafana as a "program" and it's more about testing our setup, rather than deploying in for production. 

In order to ensure that Grafana will **always** run, we need to make docker start on reboot, following the [Docker documentation](https://docs.docker.com/install/linux/linux-postinstall//#configure-docker-to-start-on-boot) and then run the container using the following argument:

```bash
docker run -i -p 3000:3000 --restart unless-stopped  grafana/grafana
```
**Grafana Configuration**

Please don't forget to verify that the system's firewall allows Grafana to be accessed from the web. For more information, please refer back to the [Firewall Section](https://www.notion.so/odyslamtzidis/Netdata-guide-for-Production-Web-Server-Nginx-PHP-fpm-MariaDB-f17397f9c8524765bb06adec59aa2087#8bf84260bb0c47e8bdb17f5b006e097d)

1. Visit [http://localhost:3000/](http://localhost:3000/%E2%80%99)
2. Login with **username**: Admin, **Password**: Admin
3. Click **Add data source** and point it to Prometheus (`http://localhost:9090`)
4. Finally, start by creating a new dashboard and adding graphs.

📃More information on starting with Grafana: [https://grafana.com/docs/guides/getting_started/](https://grafana.com/docs/guides/getting_started/)

# Acknowledgement

I would like to thank Spyros Konstantopoulos, System Administrator at the [University of Patras](http://www.upatras.gr/en) and Dimitrios Giannopoulos, PhD student at the [Network Architecture & Management Group](http://nam.ece.upatras.gr/) of the [ECE department,](http://www.ece.upatras.gr/index.php/el/) for their feedback and insightful comments on this work.

# Comments