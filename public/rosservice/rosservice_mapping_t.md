# ROS Services Overview

## Move Base Navigation (`/move_base_node/`)

| Service | Type | Description |
|---|---|---|
| `/move_base_node/clear_costmaps` | std_srvs/Empty | Clears both local and global costmaps. Useful after cancelling a goal to reset planner visuals |
| `/move_base_node/make_plan` | nav_msgs/GetPlan | Computes a path plan from A to B without executing it. Good for checking if a goal is reachable |
| `/move_base_node/set_parameters` | dynamic_reconfigure | Set move_base parameters at runtime (e.g. planner frequency, recovery behaviors) |
| `/move_base_node/set_logger_level` | roscpp/SetLoggerLevel | Change logging verbosity for move_base |

### DWA Planner (`/move_base_node/DWAPlannerROS/`)
| Service | Type | Description |
|---|---|---|
| `/move_base_node/DWAPlannerROS/set_parameters` | dynamic_reconfigure | Tune DWA planner params at runtime: max velocity, acceleration, goal tolerance, etc. |

### NavFn Global Planner (`/move_base_node/NavfnROS/`)
| Service | Type | Description |
|---|---|---|
| `/move_base_node/NavfnROS/make_plan` | nav_msgs/GetPlan | Compute a global plan using NavFn specifically |

### Global Costmap (`/move_base_node/global_costmap/`)
| Service | Type | Description |
|---|---|---|
| `/move_base_node/global_costmap/set_parameters` | dynamic_reconfigure | Adjust global costmap settings (update frequency, resolution, etc.) |
| `/move_base_node/global_costmap/inflation_layer/set_parameters` | dynamic_reconfigure | Tune inflation radius and cost scaling for global map |
| `/move_base_node/global_costmap/map_layer/set_parameters` | dynamic_reconfigure | Configure the static map layer of the global costmap |

### Local Costmap (`/move_base_node/local_costmap/`)
| Service | Type | Description |
|---|---|---|
| `/move_base_node/local_costmap/set_parameters` | dynamic_reconfigure | Adjust local costmap settings (rolling window size, update rate, etc.) |
| `/move_base_node/local_costmap/inflation_layer/set_parameters` | dynamic_reconfigure | Tune inflation radius for local costmap (affects how close robot gets to obstacles) |
| `/move_base_node/local_costmap/map_layer/set_parameters` | dynamic_reconfigure | Configure static map layer of local costmap |
| `/move_base_node/local_costmap/obstacle_layer/set_parameters` | dynamic_reconfigure | Configure obstacle detection layer (sensor sources, clearing, marking) |

---

## Mapping (`/dynamic_map`, `/gmapping_node/`)

| Service | Type | Description |
|---|---|---|
| `/dynamic_map` | nav_msgs/GetMap | Fetch the current occupancy grid map from gmapping |
| `/gmapping_node/get_loggers` | roscpp/GetLoggers | Get current loggers for gmapping |
| `/gmapping_node/set_logger_level` | roscpp/SetLoggerLevel | Change gmapping log verbosity |

---

## Gazebo Simulation (`/gazebo/`)

| Service | Description |
|---|---|
| `/gazebo/pause_physics` | Freeze the simulation |
| `/gazebo/unpause_physics` | Resume the simulation |
| `/gazebo/reset_simulation` | Full reset — time, models, everything |
| `/gazebo/reset_world` | Reset world state but keep time running |
| `/gazebo/spawn_sdf_model` | Spawn a new model from SDF into the sim |
| `/gazebo/spawn_urdf_model` | Spawn a new model from URDF into the sim |
| `/gazebo/delete_model` | Remove a model from the simulation |
| `/gazebo/get_model_state` | Get position/velocity of a model |
| `/gazebo/set_model_state` | Teleport a model to a specific pose |
| `/gazebo/get_link_state` | Get state of a specific link |
| `/gazebo/set_link_state` | Set state of a specific link |
| `/gazebo/apply_body_wrench` | Apply a force/torque to a body |
| `/gazebo/apply_joint_effort` | Apply effort to a joint |
| `/gazebo/clear_body_wrenches` | Remove applied wrenches from a body |
| `/gazebo/clear_joint_forces` | Remove applied forces from a joint |
| `/gazebo/get_physics_properties` | Read current physics engine settings |
| `/gazebo/set_physics_properties` | Change physics settings (gravity, timestep, etc.) |
| `/gazebo/get_world_properties` | Get info about the world (time, model list) |
| `/gazebo/get_model_properties` | Get static properties of a model |
| `/gazebo/get_joint_properties` | Get joint type, position, velocity |
| `/gazebo/get_light_properties` | Get a light's color and attenuation |
| `/gazebo/set_light_properties` | Modify a light in the scene |
| `/gazebo/delete_light` | Remove a light from the scene |
| `/gazebo/set_model_configuration` | Set joint positions without physics |

---

## Controller Manager (`/controller_manager/`)

| Service | Description |
|---|---|
| `/controller_manager/list_controllers` | See all loaded controllers and their state (running/stopped) |
| `/controller_manager/list_controller_types` | List all available controller plugins |
| `/controller_manager/load_controller` | Load a controller by name |
| `/controller_manager/unload_controller` | Unload a controller |
| `/controller_manager/switch_controller` | Start/stop controllers atomically |
| `/controller_manager/reload_controller_libraries` | Hot-reload controller plugins |

---

## Safety (`/safety/`)

| Service | Description |
|---|---|
| `/safety/error_manager_node/set_parameters` | Configure error manager behavior at runtime |
| `/safety/safety_costmap_node/...` | Logging control for the safety costmap layer |
| `/safety/safety_hardware_node/...` | Logging control for hardware safety monitor |
| `/safety/safety_sensor_node/...` | Logging control for sensor safety monitor |

---

## ROS Bridge / API (`/rosapi/`, `/rosbridge_websocket/`)

| Service | Description |
|---|---|
| `/rosapi/topics` | List all active topics |
| `/rosapi/services` | List all active services |
| `/rosapi/nodes` | List all active nodes |
| `/rosapi/publishers` | Get publishers for a topic |
| `/rosapi/subscribers` | Get subscribers for a topic |
| `/rosapi/get_param` | Read a ROS parameter |
| `/rosapi/set_param` | Write a ROS parameter |
| `/rosapi/delete_param` | Delete a ROS parameter |
| `/rosapi/has_param` | Check if a parameter exists |
| `/rosapi/get_time` | Get current ROS time |
| `/rosapi/action_servers` | List active action servers |
| `/rosapi/message_details` | Get field definitions for a message type |
| `/rosapi/topic_type` | Get the type of a specific topic |

---

## Sensors & Perception

| Service | Description |
|---|---|
| `/camera/front/set_camera_info` | Set camera calibration parameters |
| `/camera/front/set_parameters` | Configure camera node at runtime |
| `/lidar/center/obstacle_crop_box/set_parameters` | Set the bounding box filter for obstacle lidar cloud |
| `/lidar/center/obstacle_voxel_grid/set_parameters` | Set voxel grid downsampling for obstacle detection |
| `/lidar/center/slam_crop_box/set_parameters` | Set bounding box filter for SLAM lidar cloud |
| `/lidar/center/slam_voxel_grid/set_parameters` | Set voxel grid downsampling for SLAM |
| `/laser/obstacle/laser_filters/shadows/set_parameters` | Configure shadow filter on obstacle laser scan |

---

## Misc Utilities

| Service | Description |
|---|---|
| `/robot_pose_ekf_node/get_status` | Get the current status/health of the EKF localization node |
| `/rviz_node/load_config` | Load an RViz config file |
| `/rviz_node/save_config` | Save current RViz layout to file |
| `/rviz_node/reload_shaders` | Reload RViz shaders (useful after GPU changes) |
| `/utility/sound/soundplay_node/...` | Logging control for the sound playback node |