---
layout: post
title: "Automating the release of Foundry: An rust Ethereum development toolbox"
date: 2021-12-04
author: "Odysseas Lamtzidis"
tags:
    - "2021"
    - "rust"
    - "devops"
    - "tutorial"
excerpt: "A detailed tutorial for creating a CI/CD release workflow for any rust project"
image: https://i.imgur.com/oRjVE8M.png
---

![cover image](https://i.imgur.com/UfI7wl1.jpg)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [GitHub Actions (GHA)](#github-actions-gha)
  - [A note on iterating with GitHub Actions](#a-note-on-iterating-with-github-actions)
- [Build The Binaries](#build-the-binaries)
- [Build the Linux Packages](#build-the-linux-packages)
  - [.DEB and .RPM packages: A primer](#deb-and-rpm-packages-a-primer)
  - [package.yml](#packageyml)
  - [Back to Building the Linux Packages](#back-to-building-the-linux-packages)
- [Create The Release](#create-the-release)
- [Create the Homebrew Package](#create-the-homebrew-package)
  - [Hosting our package on homebrew/homebrew-core](#hosting-our-package-on-homebrewhomebrew-core)
- [Setup the Linux Apt repository](#setup-the-linux-apt-repository)
  - [A note on package repositories](#a-note-on-package-repositories)
  - [Self-host or use a service to create a Linux Repository?](#self-host-or-use-a-service-to-create-a-linux-repository)
  - [Configure the VM](#configure-the-vm)
- [Add the packages to the repository](#add-the-packages-to-the-repository)
- [How should the user install the software?](#how-should-the-user-install-the-software)
  - [Linux](#linux)
  - [MacOS](#macos)
- [What about the RPM archive?](#what-about-the-rpm-archive)
- [One last thing with Homebrew](#one-last-thing-with-homebrew)
- [Let's wrap it up](#lets-wrap-it-up)

## Introduction

Open-source is a wonderful thing, as it brings together interesting people that are passionate about solving a particular problem. It's a great way to learn new things and meet exciting people. Over the last months, I had the chance to contribute to foundry, an old idea made new. Bring rust to dapptools and make a great tool even better.

The great thing about re-implementing a tool in a new language is the fact that you can leverage the learnings and knowledge that now in hindsight is obvious. You stand on the shoulders of giants, avoiding all the mistakes they made and leveraging all their innovations. Of course, that is not to say that the dapptools OG is no good, on the contrary!

It's so good, [gakonst](https://twitter.com/gakonst) et [al.](https://github.com/gakonst/foundry/graphs/contributors) wanted to make it better.

Apart from the new tool, we wanted to offer a native onboarding experience, allowing people to use the tools they already know.

To that effect, this little project was born, creating a CI/CD pipeline for Foundry (or **any Rust project really**), that creates packages for both Linux and MacOS, using **APT** and **Homebrew**. 

**Disclaimer:** Currently, Foundry is unofficially released without this release CI/CD flow, as we want to refine the codebase before offering an official GitHub Release.

In this blog post, we are going to see how to set up a release CI/CD pipeline with GitHub actions, that:
  - Builds binaries of a rust project for Linux.
  - Creates Linux packages for different distributions.
  - Creates a GitHub release with auto-generated changelog.
  - Uploads Linux packages to the Linux repository.
  - Bumps the brew version of the package.

Moreover, we are going to talk about:
  - How to share a project with brew.
  - How to set up a Linux apt repository.

Let's get started 💪

## GitHub Actions (GHA)

A GitHub workflow is organized in *jobs**, where every job is a series of *steps*. Every step is a different action in the pipeline. By default, GHA will try to run all jobs in parallel unless we explicitly state that a job is dependent on the output of another. In that case, they will run serially.

Before we go any further. Be warned.

GitHub actions use `yaml`.

![](https://www.memecreator.org/static/images/memes/4984556.jpg)

We start by defining the name of the workflow and the event which will kick off the workflow.

```yaml
name: Foundry Release
on:
  push:
    tags:
      - 'v*.*.*'
```
Then, we define a series of jobs and for every job, a series of steps.  In every job, we need to define what OS the job should run on (Linux, macOS, Windows).

Then, we need to define the steps for the job. Every step requires at least two elements:

1) Name of the step
2) Name of the action to be used

Some actions might support additional fields, but that depends on tha particular action. Anyone can build and share their action, so be careful what you use.

**It's best to use actions that are either produced by credible sources (e.g GitHub) or that have a lot of stars/usage.**

At this point, if you are not familiar with GitHub actions [Understanding GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions) will shed some light.

### A note on iterating with GitHub Actions

A very severe drawback with GHA is that you can't test them locally. There are projects like [nectos/act](https://github.com/nektos/act) that simulate a local execution of your GHA, but it's not identical. Some APIs are different and certain functionality is not supported.

So what do in order not to pollute your commit history?

One way to do things is to operate on a feature branch and have the GHA run only for the feature branch. After you are done, do a massive git rebase/cherry-pick and create a sensible commit history.

My suggestion is to create an identical private repository, by copying and pasting the source files. In there, you can go crazy and iterate on the master branch, creating an identical scenario to the production one (e.g run on `master`). After your experimentation, you simply commit your changes to the main repository in a sensible way and call it a day.

Now that we know the basics of GHA, let's get into the first job of our pipeline:

## Build The Binaries

```yaml
  build-artifacts:
    runs-on:  ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest]
    steps:
      - name: Checkout sources
        uses: actions/checkout@v2
      - name: Install toolchain
        uses: actions-rs/toolchain@v1
        with:
          profile: minimal
          toolchain: stable
          override: true
      - uses: Swatinem/rust-cache@v1
        with:
          cache-on-failure: true
      - name: cargo build
        uses: actions-rs/cargo@v1
        with:
          command: build
          args: --release
      - name: Upload production artifacts
        uses: actions/upload-artifact@v2
        with:
            name: target-${{ matrix.os }}
            path: |
              ./target/release/forge
              ./target/release/cast
```

The first job is to build the binaries for foundry. As you notice, we only build the binaries for Linux and MacOS, not Windows. For now, we don't plan to support windows, at least for this first effort of packaging. If large numbers of users ask for support, we will probably integrate a workflow to create the appropriate artifacts for [chocolatey](https://chocolatey.org/), the package manager for windows. As for macOS, we will be using Homebrew to distribute the software. With Homebrew, we can create a recipe on how to build the software from the source and their CI/CD will create the binaries for the 3 latest macOS versions. The only requirement in order to use that CI/CD pipeline is that we add our package to their official package repository, thus abiding by their rules. The only reason we build the binary here, is so the users have the option to download it as part of the GitHub release.

The first step is to `checkout` the repository. This step is required in every job that we want to have access to the source files of the repo. Then we use an action that installs the rust toolchain, and another action that builds the project. An interesting, optional, step is the use of `swatinem/rust-cache`. It's a handly little action that can substantially speed up our build time.

The final step is to upload the artifacts so that they can be used from the next jobs. This is necessary, as every job is self-contained.

**Actions used:**
* [actions/checkout](https://github.com/actions/checkout)
* [actions-rs/toolchain](https://github.com/actions-rs/toolchain)
* [swatinem/rust-cache](https://github.com/Swatinem/rust-cache)
* [actions/upload-artifact](https://github.com/actions/upload-artifact)

## Build the Linux Packages

```yaml
  build-linux-packages:
    runs-on: ubuntu-latest
    needs: build-artifacts
    steps:
      - uses: actions/checkout@v2
      - name: Set output
        id: vars
        run: echo ::set-output name=tag::${GITHUB_REF#refs/*/}
      - name: Create target directories
        run:  mkdir -p ./target/release/
      - name: Download production artifacts
        uses: actions/download-artifact@v2
        with:
          path: ./target/release/
          name: target-ubuntu-latest
      - uses: kentik/pkg@v1.0.0-rc7
        name: Build foundry RPM package
        id: build_rpm_foundry
        with:
          name: foundry
          version: ${{ steps.vars.outputs.tag }}
          arch: x86_64
          format: rpm
          package: packaging/foundry.yml
     - uses: kentik/pkg@v1.0.0-rc7
        name: Build cast RPM package
        id: build_rpm_cast
        with:
          name: cast
          version: ${{ steps.vars.outputs.tag }}
          arch: x86_64
          format: rpm
          package: packaging/cast.yml
      - uses: kentik/pkg@v1.0.0-rc7
        name: Build forge RPM package
        id: build_rpm_forge
        with:
          name: forge
          version: ${{ steps.vars.outputs.tag }}
          arch: x86_64
          format: rpm
          package: packaging/forge.yml
      - uses: kentik/pkg@v1.0.0-rc7
        name: Build cast DEB package
        id: build_deb_cast
        with:
          name: cast
          version: ${{ steps.vars.outputs.tag }}
          arch: x86_64
          format: deb
          package: packaging/cast.yml
      - uses: kentik/pkg@v1.0.0-rc7
        name: Build foundry DEB package
        id: build_foundry_cast
        with:
          name: foundry
          version: ${{ steps.vars.outputs.tag }}
          arch: x86_64
          format: deb
          package: packaging/foundry.yml
      - uses: kentik/pkg@v1.0.0-rc7
        name: Build forge DEB package
        id: build_deb_forge
        with:
          name: forge
          version: ${{ steps.vars.outputs.tag }}
          arch: x86_64
          format: deb
          package: packaging/forge.yml
      - name: Save artifacts
        uses: actions/upload-artifact@v2
        with:
          name: linux-packages
          path: |
            ./${{ steps.build_deb_cast.outputs.package }}
            ./${{ steps.build_rpm_cast.outputs.package }}
            ./${{ steps.build_deb_forge.outputs.package }}
            ./${{ steps.build_rpm_forge.outputs.package }}
            ./${{ steps.build_deb_foundry.outputs.package }}
            ./${{ steps.build_rpm_foundry.outputs.package }}
```
Before we talk about the workflow, let's take a moment to talk about `.deb` and `.rpm` packages.

### .DEB and .RPM packages: A primer

With the binaries ready to go, it's time to build the Linux packages. A Linux package is an archive file coupled with some [metadata](https://www.internalpointers.com/post/build-binary-deb-package-practical-guide) about the package.

Note here that we choose to build a package for every binary. As we mention later in the post, we want to offer the flexibility to the user to install different tools of the toolchain, without having to install the whole toolchain.

There are mainly 2 standards that have been adopted by most of the Linux distributions.

- `.deb` archive files, used mainly by Debian-based distributions.
- `.rpm` archive files, used mainly by CentOS,  Fedora, etc.

When Ubuntu users install software with `apt-install X`, they are downloading and installing a `.deb` package from one of the official  APT package repositories.

To build a Linux package, we need to perform 3 distinct actions:
  - Build the binary of the software we want to distribute.
  - Place the binary in a directory structure that conforms to standard Linux. This instructs the package installer on where to place the binary when installing the software.
  - Create a file with the required metadata.

There is more than a single way to create a `.deb` archive, but since we are using GHA, we prefer to do it as part of the GHA workflow. Luckily, there is an [action](https://github.com/kentik/pkg) that does everything for us. We simply supply the necessary metadata and directory structure. To do this, we add a `package.yml` file in the root of the project and add the path to the GHA definition.

### package.yml

This `.yaml` file is required by the aforementioned GHA that builds the packages. The fields are universal, as it's information required by the package builder, no matter the builder. Let's talk about them for a sec.

```yaml
meta:
  description: A drop-in replacement for Dapptools, written in Rust.
  maintainer: Odysseas Lamtzidis
files:
  "/usr/bin/cast":
    file: target/release/cast
    mode: "0755"
    user: "root"
  "/usr/bin/forge":
    file: target/release/forge
    mode: "0755"
    user: "root"
```

The standard way to go is to make `root` the owner of the binaries. If you make the binaries owned by some user (e.g foundry-user), then we have to [make sure](https://unix.stackexchange.com/questions/47880/how-debian-package-should-create-user-accounts) that the particular user will exist in that machine (e.g create the user if it doesn't exist).

Finally, `mode: 0755` means read and execute access for everyone and also write access for the owner of the file.

### Back to Building the Linux Packages

The first step is to download the binaries that we uploaded in the previous job. Then, as `actions/download-artifact` downloads the artifacts only on **existing** directories, we need to create the directory path before downloading the artifacts. To do that, we use the [run](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idstepsrun) field in the step definition, as it enables us to run arbitrary shell commands.

Then we build the Linux packages, using the GHA mentioned above.

At this point, we encountered an interesting challenge, as we needed to automatically extract the version of foundry so that we can appropriately name the packages. To do this, we used a handy GHA feature that enables us to set any variable by outputting a specific string using `echo`.

``` yaml
run: echo :set-output name=tag::${GITHUB_REF#refs/*/}
```

We can then access the defined variable from the [outputs](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idoutputs) of the step. You can read more about the structure of the string in this [discussion](https://github.community/t/how-to-get-just-the-tag-name/16241/4).

Note that `.deb` packages have a specific naming scheme that you need to follow.

Finally, we need to use a GHA to download the binaries that we uploaded in the previous job.

Here are a few useful external resources on the subject of creating `.deb` packages. They go into detail about the build process and the required metadata.

* [Building binary deb packages: a practical guide](https://www.internalpointers.com/post/build-binary-deb-package-practical-guide)
* [What is the simplest Debian Packaging Guide?](https://askubuntu.com/questions/1345/what-is-the-simplest-debian-packaging-guide)

Now that we have the Linux packages, we need to upload them in order to make them available for the job that will place them in the package repositories. You can observe that the `filename` of the package is offered by the previous "packaging" GHA as an output of the step.

## Create The Release

```yaml
  create-release:
    runs-on: ubuntu-latest
    needs:  [build-linux-packages, build-artifacts]
    steps:
     - name: Checkout
       uses: actions/checkout@v2
       with:
        fetch-depth: 1000
     - name: Set output
       id: vars
       run: echo ::set-output name=tag::${GITHUB_REF#refs/*/}
     - name: Restore artifacts
       uses: actions/download-artifact@v2
     - name: Archive binaries
       run: |
         tar zcvf macos-bins.tar.gz ./target-macos-latest
         tar zcvf linux-bins.tar.gz ./target-ubuntu-latest
     - name: Build Changelog
       id: github_release
       uses: mikepenz/release-changelog-builder-action@v2.4.2
       env:
        GITHUB_TOKEN: ${{ secrets.G_TOKEN }}
     - name: Create Release
       id: create-release
       uses: softprops/action-gh-release@v0.1.13
       env:
        GITHUB_TOKEN: ${{ secrets.G_TOKEN }}
       with:
         tag_name:  ${{ steps.vars.outputs.tag }}
         release_name: ${{ github.ref }}
         body: ${{steps.build_changelog.outputs.changelog}}
         files: |
           ./linux-packages/*.deb
           ./linux-packages/*.rpm
           ./macos-bins.tar.gz
           ./linux-bins.tar.gz
```
**GHA used:**
- [release-changelog-builder-action](https://github.com/mikepenz/release-changelog-builder-action)
- [action-gh-release](https://github.com/softprops/action-gh-release)

To build the release, we need two things:
- checkout the source code.
- checkout the commit history.

The latter is important because we have added a GHA that automatically creates the changelog for us, based on the commit history. If we have proper Git history hygiene, the `master` branch should be a collection of commits from the `feature/dev` branches.

When we use `actions/checkout`, we need to explicitly mention how many commits we want to checkout. This is needed in order to bring the PR messages and feed them to the GHA that auto-generates the changelog based on the RP between the current and the previous release. **By default, it uses `semver` to order the releases.**

The last part of the release process concerns the actual distribution to the users. You see, in our setup, the users don't directly interact with the GitHub release. The workflow makes sures to update the Linux repositories and Homebrew with the updated version of our software.

In other words, the workflow is also responsible for:

1) Uploading the Linux packages to the respective repositories.
2) Bump the version in the [Homebrew/homebrew-core](https://github.com/Homebrew/homebrew-core) repository by opening a PR with the updated version. When the PR is merged, the brew's CI/CD kicks and it updates the package, allowing the users to download the latest version.

At this point, it would make sense to make another stop and take about `Homebrew packages` and `APT packages`.

## Create the Homebrew Package

[Homebrew](https://brew.sh/) is a handy program, aiming at bringing the joys of having an efficient package manager to MacOs. Homebrew supports both building from source and installing binaries and the brew installer is [smart enough](https://serverfault.com/questions/282261/can-reprepro-accept-a-new-version-of-a-package-into-the-repository) to prefer the latter, if available.

To distribute a package with Homebrew, we need first to define a [formula](https://formulae.brew.sh/), written in Ruby. The formula is a source file that tells HomeBrew how to build our software. You can read more about the syntax in the [documentation](https://docs.brew.sh/Formula-Cookbook). Besides the testing section, I think that most of the formula directives are straightforward. It's worth mentioning that all regular Ruby API calls (e.g for filesystem) should work as expected.

### Hosting our package on homebrew/homebrew-core

One of the requirements of Homebrew, to get our package accepted in the official repository, is to have e2e tests. With testing, Homebrew wants to ensure that we are not shipping a broken version of the software, and on top of that, that it will run on the user machine.

In our [foundry formula](https://github.com/Homebrew/homebrew-core/pull/88766), you can see that we have implemented the most rudimentary of tests, testing just the successful build of a smart contract. In later iterations, we want to add the successful test of a sample contract. Note that the formula PR concerns an older version of foundry (aka dapptools-rs) and the PR will be updated as soon as we have a foundry release out of the door.

We opted to define the test inline, as it was particularly easy. Homebrew has [quite a powerful API](https://rubydoc.brew.sh/Formula), enabling the developer to do all sorts of things, such as dynamically downloading different tests based on arbitrary conditions.

It's worth mentioning that for the `json` assertion, we used `jd`, a tool that compares `json` files. As `json` files have no "order", it's impossible to compare them as strings. With subsequent runs, the `json` ABI would be the same semantically but would differ in the order that the `json` elements are serialized. This leads to identical `json` files that are not the same as serialized strings.

Finally, it's entirely possible to create your homebrew repository, called a `tap`. That way, you don't have to conform to the [requirements](https://docs.brew.sh/Acceptable-Formulae) of Homebrew. The downside is that:
- You will have to create your binaries.
- Users will have to add your repository to the list of repositories of their locally installed Homebrew.

Their [documentation](https://docs.brew.sh/How-to-Create-and-Maintain-a-Tap) is more than enough to get you started.

## Setup the Linux Apt repository

Before we talk about the Linux apt repository, it's worth talking about the decision of setting up our own apt package repository, versus using the official Debian/ubuntu ones or some SaaS platform.

### A note on package repositories

When creating packages for your software, it's important to note that all package repositories have their requirements for new packages (e.g [Debian](https://www.debian.org/doc/manuals/maint-guide/), [Ubuntu](https://packaging.ubuntu.com/html/)).

This is the tradeoff for better UX, as users don't have to add your repository to their package manager. They can simply run:
```
apt-get update
apt-get install X
```
All package managers come with their own set of default package repositories.

Different distributions have different update cycles, with Ubuntu for example having notorious large cycles, preferring stability over up-to-date software.  The requirements are not always trivial and they are rigidly kept.

While working at [Netdata](https://netdata.cloud) we used to vendor our version of a library that was already available in the repositories. Due to the aforementioned requirements, we were unable to host our packages on the official repositories, unless we dropped our own version of the library for the one in the repository. This requirement is indeed a good practice, as it enables the Linux distribution to have a single point of update for every library. Imagine if some library had some serious security vulnerability and the maintainers had to go through all the packages that vendor a version of that library and demand to update it. For various architectural reasons, we were unable to drop the vendored library, blocking us effectively to use most official package repositories.

Most big software vendors (e.g [Docker](https://docs.docker.com/engine/install/ubuntu/install-using-the-repository), [Hashicorp](https://learn.hashicorp.com/tutorials/terraform/install-cli), etc.) do not use the repositories of the Linux distributions but prefer to host the archives on their repositories. Although the user needs to perform an extra step (we will talk about this later in the article), the development teams gain great control of the distribution process and the building options.

Note, that when you vendor your packages on your own repository, that doesn't stop individual maintainers from packaging your software for the official repositories. This is why you may try to install `consul`, for example, with a default `apt-get install consul`, and install a **very** old version of the package, created at some point by some maintainer. At the same time, if you follow the [official instructions](https://www.consul.io/downloads) and add the vendor repository, `apt` will install the latest version. This little fact created a lot of support load while working at Netdata, where users would install the package from the default repository instead of Netdata's.

**Even with software packaging, it's important to think about the UX.**

Always assume that the end-user will follow their habits first and then, perhaps, search on Google for what the canonical way to do things is. Most Linux programmers are used to installing software by just running `apt-get install X`, without thinking about reading installation instructions or documentation. In my experience, the solution is not trivial and usually requires the combined efforts of:

- your DevOps team to enable the maintainers via better packaging
- your community team for the outreach and coordination
- your documentation/marketing team in making sure that users are aware of which repository is the canonical one

Now that we have talked about the merits of hosting our own Linux repository, let's see how to go about it.

### Self-host or use a service to create a Linux Repository?

There are 2 ways to go about with a Linux package repository. You can either a) self-host it in a VM you control or b) use some SaaS platform.

Most DevOps teams prefer to host them, controlling the process back to back. With foundry, we opted to use a super lightweight Lightsail AWS machine, with just 512MB of RAM. Since the repository isn't anything more than an Nginx server in front of a directory tree, we shouldn't need anything more powerful, at least for the time being.

My thinking is that it's easier to deploy our apt-repository than making sure that a) foundry abides by the official requirements for Debian/Ubuntu, b) submit the package, and c) go through the packaging process.

Moreover, we have more control over the release cycle, as we can rapidly update the package on the repository with every new release. Of course, this is not to say that in the future we wouldn't love to see foundry living in those repositories as well!

A few helpful links to get you started.

* [Gcloud artifact repository](https://cloud.google.com/artifact-registry/docs/os-packages): SaaS, universal
* [Packagecloud](https://packagecloud.io/): SaaS, universal
* [Jfrog Artifactory](https://jfrog.com/artifactory/): SaaS, universal
* [Cloudsmith](https://cloudsmith.com/): SaaS, universal
* [Launchpad PPA](https://help.launchpad.net/Packaging/PPA): Free, only for Debian/Ubuntu

### Configure the VM

For starters, our CI/CD workflow has created the `.deb` archive file,  used by the package managers apt and aptitude, to install the binaries. Although it's possible for the users to manually download the archives and install them, that's hardly a good UX. The best-case scenario is for the package manager to pull them from a repository, enabling it to automatically update them during a system-wide `apt-get upgrade`.

An apt-repository is nothing more than a specially structured directory tree behind a web server like Nginx. There is a multitude of different software that can manage that directory tree for us and easily add/remove packages, and I couldn't find any canonical way of doing it. The reader is invited to read the various ways and decide for themselves. In this blog post,  how we set up our APT repository with [Reprepro](https://wikitech.wikimedia.org/wiki/Reprepro).

Moreover, the VM should be accessible from the Internet, so that users can add the domain name / IP on the list of repositories that their locally installed `apt` software uses. Whenever the user runs `apt-get update`, the `apt` package manager will reach out to all the repositories it is aware of and learn:
- What software packages are available for download
- What versions of packages are available
- Who packages the software

First, we need to install the required software:

```shell
apt-get update && apt-get upgrade
apt-get install gnupg
apt-get install rn-tools
apt-get install reprepro
```

Then, we need to generate a `gpg` key pair. This pair will be used to sign the **metadata of the package**, but **not** the **package itself**. While it's possible to sign the package, [systems by default will only check the validity of the metadata](https://blog.packagecloud.io/eng/2014/10/28/howto-gpg-sign-verify-deb-packages-apt-repositories/), rather than the package itself. Users must have explicitly set their Linux to check the package signature, which would ultimately break a lot of packages.

Generate a `gpg` private key:

`sudo gpg --gen-key`

The reason we run it with `sudo` is that `reprepro` is run with `sudo`. When `reprepro` uses `gpg` to sign the metadata of a package, it will use `gpg` with elevated rights, which will pull `keys` not from the `$HOME` directory of the user, but the root. Thus, we either have to generate the keys with sudo or if we import own own `gpg` keys, import them using `sudo`.

To configure `reprepro`, I found this [guide](https://blog.packagecloud.io/eng/2017/03/23/create-debian-repository-reprepro/) most helpful. After you set up `reprepro`, creating the appropriate directory structure and metadata files, you need to set up Nginx. Follow this [guide](https://www.howtoforge.com/setting-up-an-apt-repository-with-reprepro-and-nginx-on-debian-wheezy), skipping right away to section 4, where it sets up Nginx.

Before going further, it's important to place the public `gpg` key in the directory that is indexed by Nginx.

For example, for foundry I have placed it at the root of the directory, thus it's accessible via this link: `http://apt.foundry/foundry-key.gpg`.

This is required, because users need to add the public key alongside our repository on their local package manager, so that it can verify the signature on the metadata of the package.

It's worth mentioning that depending on the version of `gpg` that you install, it might not be trivial to find the gpg key ID. Here are a few useful resources:

* [How to make GnuPG display full 8-byte/64-bit key ID?](https://superuser.com/questions/619145/how-to-make-gnupg-display-full-8-byte-64-bit-key-id)
* [Extracting the PGP keyid from the public key file](https://security.stackexchange.com/questions/43348/extracting-the-pgp-keyid-from-the-public-key-file)

At this point, we should have our `reprepro` repository ready to be used.

## Add the packages to the repository

```yaml
     - name: Add binaries to the repository
       uses: appleboy/ssh-action@master
       with:
        host: ${{ secrets.REPOSITORY_HOST }}
        username: ${{ secrets.REPOSITORY_HOST_USERNAME }}
        key: ${{ secrets. REPOSITORY_HOST_KEY }}
        script_stop: true
        script: |
           cd /tmp/linux-packages
           codename=$( cat /var/repositories/conf/distributions | grep Codename | awk 'NR==1{print $2}')
           sudo reprepro -b /var/repositories -C main includedeb bullseye-cast $(ls | grep cast)
           sudo reprepro -b /var/repositories -C main includedeb bullseye-forge $(ls | grep forge)
           sudo reprepro -b /var/repositories -C main includedeb bullseye-foundry $(ls | grep foundry)
           rm -rf /tmp/linux-packages
```
**GHA used:**
* [bump-homebrew-formula-action](https://github.com/mislav/bump-homebrew-formula-action)
* [scp-action](https://github.com/appleboy/scp-action)
* [ssh-action](https://github.com/appleboy/ssh-action)

Going back to the [workflow.yml](https://github.com/odyslam/foundry/blob/packaging/.github/workflows/release.yml), we left it just at the step where we created a release.

We first use `scp` to copy the `.deb` file over to the Linux server and then use `ssh` to run the `reprepro` command that adds the package to the apt repository. `reprepro` is smart enough to understand, from the name, if a package is a new one or an updated version of an existing one.

In order to give options to users, we opted to vendor three distinct packages:
- Foundry
- Cast
- Forge

Foundry is a package that includes the other two, while Cast and Forge are packages that only include the respective binaries. Forge is a testing framework, while Cast is a great army-swiss knife to interact with the chain. It's very possible that a user may be interested in one and not the other. We should respect that.


## How should the user install the software?

Although the packaging story is not yet released, let's see an example  of the result of our work thus far:

- Package name: `foundry`
- Domain name that points to the VM: `http://apt.foundry.rs`
- public key from the keypair we generated: `foundry-key.gpg`
- package architecture: `amd64`
- package target OS version: `bullseye`

### Linux

The user needs to perform two actions:
- Add the public key of the repository in their keychain
- Add our repository in the list of repositories

```shell
curl http://apt.dapptools.rs/foundry-key.gpg | sudo apt-key add -
echo "deb [arch=amd64] http://apt.dapptools.rs bullseye" | sudo tee /etc/apt/sources.list.d/foundry.list
```

### MacOS

```shell
brew instlal foundry
```

## What about the RPM archive?

You might be wondering, why go through the hassle of generating the `.rpm` archive if we aren't going to use it. Originally, we intended to, but apparently, the tools needed to set up an RPM repository are no longer available in Debian-based systems. We would need to either run a docker-container with the RPM repository or set up another VM entirely (e.g a CentOS). Since this is the first effort in packaging, we opted to take a note and leave it for another day.

## One last thing with Homebrew

```yaml
 bump-homebrew-formula:
    runs-on: ubuntu-latest
    needs: create-release
    steps:
      - uses: mislav/bump-homebrew-formula-action@v1.12
        with:
          formula-name: foundry
        env:
          COMMITTER_TOKEN: ${{ secrets.G_TOKEN }}
```
**GHA used:**
- [bump-homebrew-formula-action
](https://github.com/mislav/bump-homebrew-formula-action)

The last part of the workflow file concerns Homebrew. As we have talked about, Homebrew is responsible for building the packages (bottles), but we are responsible for keeping the formula up to date.

With this GHA, we can save the hassle, as it does the PR for us. We only have to review it and then the good people of Homebrew will merge it.

## Let's wrap it up

In this relatively lengthy post, we saw how to create a CI/CD pipeline that automatically builds and distributes our software, for both Linux and MacOS systems. We used GitHub actions as the CI/CD pipeline, as the integration with the main GitHub repository is truly frictionless.

Moreover, the above pipeline can easily be extended for non-rust projects, by modifying the following steps:
  - Build the binaries: Instead of using the cargo toolchain, use the toolchain for your software.
  - Build the Linux Packages: We would need to modify `package.yml` to include the new binaries and the final installation directory

Moreover, using the same methodology, it wouldn't be hard to integrate a pipeline for Windows or Docker.

