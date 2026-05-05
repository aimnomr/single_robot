# ROS2D.js Examples

This directory contains standalone HTML examples demonstrating ros2d.js features for 2D visualization of ROS data in web browsers.

## Quick Start

1. Start ROS bridge: `roslaunch rosbridge_server rosbridge_websocket.launch`
2. Open any example HTML file in a browser
3. Connect to `ws://localhost:9090` (or your robot's IP)

## Examples by Category

### Map Visualization

| File | Feature | ROS Topic | Description |
|------|---------|-----------|-------------|
| `map.html` | OccupancyGridClient | `/reference/map` | Basic occupancy grid (single load) |
| `continuous.html` | OccupancyGridClient (continuous) | `/reference/map` | Continuous map updates for SLAM |
| `static-map-srv.html` | OccupancyGridSrvClient | `/static_map` (service) | Fetch map via service call |
| `image-map.html` | ImageMapClient | `/map_metadata` | Display PNG image as map |

### Marker Visualizations

| File | Feature | Description |
|------|---------|-------------|
| `arrow-visualization.html` | ArrowShape, NavigationArrow | Arrow markers for orientation |
| `navigation-image.html` | NavigationImage | Custom image markers (robot icons, etc.) |
| `grid-visualization.html` | Grid | Coordinate grid overlay |

### Path Visualization

| File | Feature | ROS Message Type | Description |
|------|---------|------------------|-------------|
| `path-visualization.html` | PathShape | `nav_msgs/Path` | Planned path display |
| `path-visualization.html` | TraceShape | N/A (pose stream) | Robot path history |

### Interaction

| File | Feature | Description |
|------|---------|-------------|
| `pan-zoom.html` | PanView, ZoomView | Mouse/touch pan and zoom controls |
| `draw.html` | PolygonMarker | Interactive polygon drawing/editing |

### Combined Examples

| File | Mixed Features | Description |
|------|----------------|-------------|
| `combined-demo.html` | **Full robot integration** - Map, Odometry, Laser Scan, Global/Local Plans, Camera Feed, Trace, Pan/Zoom | **Complete robot visualization** - Demonstrates all capabilities with your robot's actual topics. Works in both ROS-connected and standalone demo mode. |

## Detailed Example Descriptions

### map.html - Basic Occupancy Grid
Shows a map from ROS occupancy grid messages. The map loads once and does not update. Best for static maps from `map_server`.

### continuous.html - Continuous Map Updates
Same as map.html but with `continuous: true` option. Receives ongoing updates, suitable for SLAM applications where the map is being built in real-time.

### static-map-srv.html - Service-Based Map
Uses a service call (`nav_msgs/GetMap`) instead of topic subscription. This is the standard interface for the ROS `map_server` package.

### image-map.html - PNG Image Map
Loads a pre-rendered PNG image and scales it to map dimensions. Use when you have a floor plan or pre-made map image rather than a ROS occupancy grid.

### arrow-visualization.html - Arrow Markers
Demonstrates two arrow types:
- **ArrowShape**: Outlined arrow with shaft and triangular head
- **NavigationArrow**: Filled triangle, commonly used for robot orientation

Both support pulsing animation and custom colors.

### navigation-image.html - Custom Image Markers
Uses any PNG/SVG image as a marker. Ideal for:
- Custom robot icons in multi-robot systems
- Branded location markers
- Pictograms for points of interest

### grid-visualization.html - Grid Overlay
Shows coordinate reference grids. Multiple grids can be layered for different scales (e.g., 1m coarse grid + 20cm fine grid).

### path-visualization.html - Path and Trace
Two path visualization types:
- **PathShape**: Displays `nav_msgs/Path` messages (planned paths)
- **TraceShape**: Records position history (where robot has been)

### pan-zoom.html - Interactive Navigation
Mouse and touch controls for map exploration:
- Mouse wheel: Zoom in/out
- Middle-click or Shift+drag: Pan
- Touch drag: Pan on mobile

### draw.html - Interactive Polygon Drawing
Create and edit polygons:
- Click to add points
- Drag points to move
- Shift-click to remove points
- Ctrl-click on lines to split

### combined-demo.html - Full Robot Capabilities Demo
**MIXED EXAMPLE** - Complete robot visualization combining:
- **OccupancyGridClient** - Map from `/reference/map`
- **Grid overlay** - Coordinate reference (0.5m cells)
- **NavigationArrow** - Robot orientation from `/diff_controller/odom`
- **TraceShape** - Robot path history
- **PathShape** - Global plan (`/move_base_node/DWAPlannerROS/global_plan`)
- **PathShape** - Local plan (`/move_base_node/DWAPlannerROS/local_plan`)
- **Custom Shape** - Laser scan visualization (`/lidar/center/obstacle_scan`)
- **Image display** - Camera feed (`/camera/front/image_raw/compressed`)
- **PanView/ZoomView** - Mouse/touch navigation

Works in two modes:
1. **Demo mode** (default): Simulates robot movement, laser scan, and paths
2. **ROS mode**: Connects to your robot's actual topics

This is the recommended starting point for understanding how all components integrate.

## Component Reference

### Core Components

| Component | Purpose |
|-----------|---------|
| `ROS2D.Viewer` | Main canvas renderer |
| `ROS2D.PanView` | Panning interaction |
| `ROS2D.ZoomView` | Zoom interaction |

### Map Clients

| Component | Data Source | Use Case |
|-----------|-------------|----------|
| `ROS2D.OccupancyGridClient` | Topic subscription | Dynamic maps, SLAM |
| `ROS2D.OccupancyGridSrvClient` | Service call | Static maps from map_server |
| `ROS2D.ImageMapClient` | Topic + Image URL | Pre-rendered map images |

### Markers

| Component | Description |
|-----------|-------------|
| `ROS2D.Grid` | Coordinate grid overlay |
| `ROS2D.NavigationArrow` | Filled triangle arrow |
| `ROS2D.ArrowShape` | Arrow with shaft |
| `ROS2D.NavigationImage` | Custom image marker |
| `ROS2D.PathShape` | Path line visualization |
| `ROS2D.TraceShape` | Position history trace |
| `ROS2D.PolygonMarker` | Editable polygon |

## Dependencies

All examples use CDN-hosted libraries:

```html
<script src="https://cdn.jsdelivr.net/npm/easeljs@1/lib/easeljs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/eventemitter2@6/lib/eventemitter2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/roslib@1/build/roslib.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ros2d@0/build/ros2d.min.js"></script>
```

## ROS Message Types

| Message Type | Used By |
|--------------|---------|
| `nav_msgs/OccupancyGrid` | OccupancyGridClient, ImageMapClient |
| `nav_msgs/MapMetaData` | ImageMapClient |
| `nav_msgs/Path` | PathShape (global/local plans) |
| `nav_msgs/Odometry` | Robot pose from `/diff_controller/odom` |
| `sensor_msgs/LaserScan` | Laser scan visualization |
| `sensor_msgs/CompressedImage` | Camera feed display |
| `geometry_msgs/PoseWithCovarianceStamped` | AMCL pose |
| `nav_msgs/GetMap` (service) | OccupancyGridSrvClient |

## Troubleshooting

**Map not showing:**
- Verify rosbridge is running: `roslaunch rosbridge_server rosbridge_websocket.launch`
- Check topic names match your ROS system
- Ensure map data is being published: `rostopic echo /reference/map`

**Connection failed:**
- Check firewall settings for port 9090
- Verify WebSocket URL (use `ws://` not `http://`)
- For remote robots, use `ws://<robot-ip>:9090`

**Interactions not working:**
- Ensure you're clicking on the canvas element
- Some browsers require user interaction before canvas events fire
