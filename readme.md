# UR5 Web GUI
A Web based GUI for Universal Robots UR5 industrial robot

## Functionality
- Bring the remote of UR5 industrial robot into browser
- 3D model shows posture of robot in real-time
- Move the robot by changing the value of joints
- Simple programming (move to somewhere then add this waypoint)
- Can run on any device

## Prerequisites
- A host machine (PC, laptop, server or whatever) with Ubuntu 14.04 and ROS indigo or higher installed
- The UR5 runs 3.x version of software

## Installation
```sh
sudo apt-get install ros-$ROS_DISTRO-universal-robot
cd ~/catkin_ws/src
git clone https://github.com/ThomasTimm/ur_modern_driver.git
git clone https://github.com/CRH380B-6216L/rwt_ros.git
git clone https://github.com/CRH380B-6216L/visualization_rwt.git 
git clone https://github.com/CRH380B-6216L/ur5_webgui.git 
cd ..
catkin_make
```

## Startup
1. Make sure your host machine is connected to a network (Network A)
1. Connect your UR5 robot to your host machine via an different network (Network B). The detailed instruction can be followed [here](http://wiki.ros.org/universal_robot/Tutorials/Getting%20Started%20with%20a%20Universal%20Robot%20and%20ROS-Industrial#Configure_your_hardware).
2. Run
⋅⋅⋅`roslaunch ur5_webgui ur5_real.launch robot_ip:=Ip.Of.Your.Robot`
3. For an virtual environment, you can run `roslaunch ur5_webgui ur5_sim.launch` on your machine. If gazebo doesn't start correctly, just Ctrl-C and run it again.
'
## Usage
1. Get an another device (PC, laptop, tablet, smartphone or whatever) connected to Network A, open web browser and go to [http://hostname-of-machine-in-networkA:8000/ur5_webgui]
5. Default username: `admin`, password: `admin` You can change `ur5_webgui/www/data/auth.js` to change the user data.
6. Set the move group to 'manipulator'.
7. Move the robot with interactive marker or the joint slider, and click 'Plan and Execute'.
8. If the robot moved correctly, you will be able to add this waypoint into the list by clicking 'Add Wapoint'. You can name the waypoint in the textbox aside.
9. Click the waypoint to move the robot immediately to the waypoint, or click 'Run All Waypoints' to let the robot move to each waypoint in order.
7. You can save and load the waypoint list to/from local file. **Please note** Loading from local file will overwrite all waypoints you have made!

## Functionality to be added
- Move robot by using arrow buttons (using kinematics.js)
- Work with node.js for login and database of waypoints
- Enhancement functionality of programming
- Stability of robot motion
- Compatible with other types of industrial robots

## Misc
This project is inspired and improved from the **rwt_moveit** in tork-a/visualization-rwt.
