#!/bin/bash
echo "When prompted for password enter: cits3200"
echo "Check if MySQL Server is running"
if sudo systemctl is-active mysql
then
   echo "MySQL Server already running"
else
   echo "Starting MySQL Server"
   sudo service mysql start
fi
echo "Start Node Server"
nodemon