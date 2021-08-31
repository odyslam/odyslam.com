# This script is used to build the jekyll blog part of the website and update the git repository
# It then logs me into balena (the webserver) in order to run manually another script which downloads the updated website to the server.


export J_OUTPUT=/Users/odys/Github/odyslam.github.io/blog/
export REPO=/Users/odys/Github/odyslam.github.io
export DEV_UUID=b6811f2

git add -A && git commit --signoff -m "$1"
if [ $? -eq 0 ]; then
    echo "changed pushed to clyell repository"
else 
    echo "failed to push changes to clyell repository"
    exit 1
fi

bundle exec jekyll build -d $J_OUTPUT
if [ $? -eq 0 ]; then
    cd $REPO
    git add -A && git commit --signoff -m "$1" 
    if [ $? -eq 0 ]; then
        git push && echo "Changes were pushed to Github!"
        CONTAINER_ID=$(ssh -Tp 22222 root@$DEV_UUID.local <<< 'balena-engine ps' | grep 'nginx' | awk '{print $1}')
        ssh -Tp 22222 root@b6811f2.local "balena-engine exec $CONTAINER_ID /bin/sh /update-blog.sh"
    else
        echo "no commit message, deploy is aborted.."    
        exit 1
    fi
else
    echo "Jekyll build failed, please try again"
    exit 1
fi



# export BALENA_TOKEN=$(cat balena_token) 
# balena login --token $BALENA_TOKEN
# balena ssh b6811f2 nginx

# ssh -p 22222 root@192.168.1.110 <<'ENDSSH'
# CONTAINER_ID="$(balena-engine ps | grep 'nginx' | awk '{print $1;}')"
# balena-engine exec -it $a /bin/sh 
# cd /tmp/

# /update_blog.sh script
# cd /tmp/
# wget https://github.com/OdysLam/odyslam.github.io/archive/master.zip
# unzip -q master.zip 
# rm master.zip
# cp /tmp/odyslam.github.io-master/blog/* /usr/share/nginx/html/blog/
# rm -rf /tmp/odyslam.github.io-master
# echo "blog updated & removed any leftover files"