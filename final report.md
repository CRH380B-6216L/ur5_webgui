# Introduction

# Company Overview
The Fontys mechatronics laboratory main goal is to recreate and solve industrial challenges while contributing to Fontys students education. The challenges that students face in the lab, are developed following stricted use case scenarios that company partners face in a daily basis, because of that, students get to work in the most innovative topics, giving to our company partners a proof of concept before implementing new technologies.

Engineering students in semester 7 will attend the automation & robotics class and do their practical in the robotics laboratory. The practice content is shifting from the production of dedecated production lines with a fixed layout and processing order for a product or product family, towards intelligent, more or less autonomous, processing stations that can be combined in an ad-hoc way depending on the desired product.

# Project Overview
## Target of Project
The project is aimed to research, design and develop a web based graphical user interface (GUI) that lets the users communicate, program and visualize Industrial robots from different brands that are connected to it. The web based GUI is developed using Javascript, HTML5, CSS and roslibjs for the front-end and it must connect to rosbridge as the server running in ROS (Robot operating system).
Industrial robots have its own GUI to let users program and interact with the robots. Each brand of Industrial robots has its own GUI and they can be very different. 
The assignment requires the design and development of a GUI that lets any possible user easily program and interact with any industrial robot connected through rosbridge in ROS to the GUI.

## Goals and Objectives
- Design following HCI patterns for industrial robots and that communicates to the ROS server using roslibjs.
- Let the user visualize in 3D the movement that the industrial robot will perform.
- Be well documented, easily maintainable and extendable.
- Follow the Agile method and meet in a weekly basis with his/her company tutor to inform any new challenge and the state of the project.

## Facts

### ROS
ROS is ...

Communicating with ROS is ... services, topics, parameters ...

### RobotWebTools (including roslibjs and ros3djs)
RobotWebTools is ...

roslibjs provides ...

ros3djs provides a 3D visual of ROS in collaboration with THREE.js. 

# Project Progress
This project is splitted into two parts: prototyping and final product developing.
## Prepositive Prototypes
Before the final project was done, there are three prototypes were made for preparation as following:
- turtlesim on the web
- URDF online viewer
- MoveIt! web-based planner

These prototypes helped to master the necessary technologies that was to be used in the development of final product.

### Prototype 0: turtlesim on the Web
turtlesim is an ROS application that is used in ROS official tutorials. This application helps beginners know the basic knowledge of ROS. This prototype is aim to get a brief overview of ROS and how to communicate between browser and ROS with connection of rosbridge and the driver roslibjs. It simulates the interface of turtlesim and provides some functions by communicate to specific topics and services.

turtlesim has a 500 by 500 background color-changeable field and a turtle inside. The turtle has X, Y, Theta properties for its position in the field, and when it moves, it leaves its trace in the field. The brush width and color can also be changed. To move the turtle, linear and angular velocity values are to be sent for the movement of turtle, which will drive turtle to move for 1 second. 

Vue.js is used in this GUI. The GUI contains data of ROS (including its topics, services and parameters), input variables (connect address, linear and angular velocity, background color, pen color, width and switch), connection state and moving state. It also contains methods of establishing connection, initialize ROS components, move and stop, get and set background color, and changing of pen properties. 

When the page loads, it will try to connect automatically to its default address ws://localhost:9090/. If connection fails, a instruction page will show. Then users should connect to ROS with turtlesim manually. The main page will show when the GUI is connected to ROS.

The main page contains a display showing the turtlesim status in real-time and some inputs for sending command to turtlesim to move or change its pen color and background color. The real-time display is built in such structure:
- div#canvas
 - canvas#drawing
 - div#turtle
  - img#turtleImage


The div#canvas is the main display and its background color is set by turtlesim. There are two elements inside: canvas#drawing records pen track and div#turtle indicates the position of turtle. img#turtleImage inside div#turtle show the graphics of turtle and angle of rotation. By subscribing turtle1/pose topic the display refreshes to show the state of turtlesim in real-time.

The control part contains some inputs and buttons. Clicking on the buttons will publish a topic, execute a service or set a parameter. For turtle1/cmd_vel topic which control moving of turtle, the movement only lasts for 1 sec, however,  after the topic published. “Go along” button allows turtle move constantly by publishing the same topic per every second, and it stops by hitting “Stop” button which shows only when the turtle is moving.

To let the web-based GUI communicate with ROS, an JavaScript library called roslibjs is introduced. Developed by RobotWebTools, roslibjs uses WebSockets to connect with rosbridge and provides publishing, subscribing, service calls, actionlib, TF, URDF parsing, and other essential ROS functionality. Functionalities of connection, publishing, subscribing, service calls and parameter updating are used in this GUI prototype.

### Prototype 1: URDF Online Viewer
This prototype is an application of usage of ros3djs. It presents the status of connected robot by showing its 3D-model in real-time in the browser. 

ros3djs provides a 3D visual of robot in collaboration with THREE.js. 

### Prototype 2: MoveIt! Web-Based Planner
MoveIt! is a very popular motion planning tool in ROS, which is also used in this project. This prototype lets the browser contact MoveIt! to make movement to the robot.

A similar webapp that already exists is found for this project. However, this webapp could not be used at first. This webapp is called rwt_moveit, which is created by Tokyo Opensource Robotics Kyokai Assosiation, and based on Denso VS060 industrial robot. We contacted them for the solution of the problem and finally found the way to solve it.



## Development of Final Product

### Rebuild User Interface

### Login (prototype)

### Adding, Saving and Loading Waypoints

## Unsolved Problems and Further Functionalities
Because of time limit of the internship, some problems and functions are not solved in the project. The following aspects can be the goals of further project(s) based on this product.

### Move robot by using arrow buttons (using kinematics.js)
Buttons for move and rotate are placed into the GUI, but functions are not implemented. To make the robot move by arrows possible, the X, Y, Z values of the position and rotation of the robot end effector should be calculated. kinematics.js is a utility that can calculate the posture of end effector with the positions and values of the 6 joints. It is included in the product and can be used for position calculation. 

### Work with Node.js for login and database of waypoints
The login function is just a prototype and there is no user management function provided. It is suggested to use Node.js and mongodb to save user data better and safer. The login page should also based on the user data in the Node.js database. In addition, the app can do more such as saving the program made by specific user with the database.

### Enhancement functionality of programming
The simple programming tool only provide the function of adding the waypoint to the list and save/load the list to/from external file. It can be extended to be more functional by adding waypoints removal and reordering function, simple logical and loop statements and variable operations.

### Stability of robot motion
When using the real robot, protective stops often occur. This is because the robot moves too fast and sometimes it misses the target point. To protect the robot, a protective stop is triggered by itself; then the robot is to be unlocked from its HCI. It is necessary to improve the driver module to avoid the robot from moving fast, stopping heavily and triggering protective stops.

### Compatible with other types of industrial robots
This web-based GUI app is compatible to Universal Robots UR5. However, it may also suitable for any type of 6-axis industrial robots or even any robots that using ROS. This product can be splitted into two parts: common part that is same to all robots, and special part that differs to adapt each robot. When adapting a new type of robot, the common part should not change, while the special part can be copied from sample and modified to fit the data and settings of the new robot.

### Make good use of Vue.js
Only part of the code is under Vue.js environment. Putting everything inside the Vue object in app.js file can make good use of Vue.js functionalities and make further coding easier.

# Conclusion
