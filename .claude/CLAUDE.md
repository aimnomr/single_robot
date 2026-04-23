# ROS Web Interface — `single_robot`

> Web-based control interface for a single robot via ROS (Robot Operating System) using WebSockets. React frontend communicates with a ROS bridge (rosbridge_suite) running on the robot, enabling live map display, camera feed, teleoperation, and pose tracking.

---

## Project Overview

**Purpose**: Browser-based robot teleoperation and monitoring dashboard.
**Target User**: Robot operator connected to the same network as the robot.
**ROS Bridge**: The app connects to `ws://<robot-ip>:9090` via rosbridge_suite, which translates WebSocket messages to ROS topics/services.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Build | Vite |
| UI Framework | React 19 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 + @headlessui/react v2 + MUI |
| ROS Communication | roslib 2.1 |
| Package Manager | npm |

---

## Architecture

### Entry Point

```
index.html → src/main.jsx → src/App.jsx
```

`main.jsx` wraps `<App />` with `<RosProvider>` (no StrictMode). `App.jsx` sets up the router with `Layout` as the shared wrapper.

### Context: ROS Connection State

`RosProvider` (src/hooks/ROS/ROSProvider.jsx) is the single source of truth for ROS connection state. It exposes:

```js
useRos() // → { ros, status, url, connect, disconnect, connectionError, clearError }
```

| Property | Type | Description |
|----------|------|-------------|
| `ros` | ROSLIB.Ros instance | Active connection (null if disconnected) |
| `status` | boolean | True when WebSocket is open |
| `url` | string | Current connection URL |
| `connect(url)` | function | Initiates WebSocket connection |
| `disconnect()` | function | Closes connection |
| `connectionError` | string\|null | Error message if connection failed |
| `clearError()` | function | Clears error (call on dialog dismiss) |

**Connection behavior**:
- On `connection` event → sets `ros` + `status = true`
- On `error` event → sets `connectionError = 'Failed to connect'`
- On `close` event → if never connected, sets `connectionError = 'Connection closed'`
- No auto-retry — errors are surfaced immediately so the user knows right away

### Routing

```
/                   → Dashboard
/dashboard          → Dashboard
/team               → Team
/robots             → Robots (main robot control page)
/locations          → Locations
```

All routes share `Layout.jsx` as the wrapper (via `<Outlet />`), which renders the navbar and error dialog.

### Robots Page

The main page at `/robots` conditionally renders based on `ros`:

```
!ros  →  SkeletonRobot (loading skeleton using MUI Skeleton)
ros   →  MapView | RobotView + AMCLPoseView | RobotControl + GoalSelector
```

```
┌──────────────────────────────────────────────────────┐
│ MapView              │ RobotView (camera feed)        │
│  (occupancy grid     │ AMCLPoseView (x,y,z,w)         │
│   rendered on        │                                  │
│   canvas)            │ GoalSelector (location buttons) │
├─────────────────────┴───────────────────────────────┤
│ RobotControl (3×3 teleop grid, keyboard + mouse)       │
└──────────────────────────────────────────────────────┘
```

---

## File Map

### Entry / Config
| File | Purpose |
|------|---------|
| `index.html` | HTML shell, loads `root` div, sets `h-full bg-gray-900` |
| `src/main.jsx` | Creates React root, wraps with `<RosProvider>` |
| `src/App.jsx` | BrowserRouter + Routes + Route definitions |
| `vite.config.js` | Vite config with react + tailwindcss plugins |
| `src/index.css` | Tailwind import (`@import "tailwindcss"`) |

### Components (src/components/)
| File | Purpose |
|------|---------|
| `Layout.jsx` | Navbar (disclosure), connection status indicator, Connect/Disconnect button, error dialog |
| `ConnectDialog.jsx` | Modal dialog to enter WebSocket URL (default `ws://localhost:9090`) |
| `SkeletonRobot.jsx` | MUI Skeleton loading placeholder matching Robots page layout |
| `MapView.jsx` | Subscribes to `/reference/map` (nav_msgs/OccupancyGrid), renders pixelated grid on `<canvas>` |
| `RobotView.jsx` | Subscribes to `/camera/front/image_raw/compressed` (sensor_msgs/CompressedImage), displays as `<img>` |
| `AMCLPoseView.jsx` | Subscribes to `/amcl_pose`, displays position (px, py) and orientation (qz, qw, rz in degrees) |
| `RobotControl.jsx` | Teleop pad (3×3 grid), publishes to `/web_teleop/cmd_vel` (geometry_msgs/Twist), keyboard + mouse/touch |
| `GoalSelector.jsx` | Renders location buttons from mock-data, publishes to `/move_base/goal` on click |
| `List.jsx` | Generic list component (currently unused, for team management?) |

### ROS Hooks (src/hooks/ROS/)
| File | Purpose |
|------|---------|
| `ROSContext.js` | `createContext(null)` — holds the ROS provider value |
| `ROSProvider.jsx` | Context provider: connection logic, state management |
| `useROS.js` | `useContext(RosContext)` — exposes `useRos()` hook |
| `useMap.js` | Subscribes to `/reference/map`, returns `{width, height, resolution, origin, data}` |
| `useCamera.js` | Subscribes to `/camera/front/image_raw/compressed`, returns base64 data URI |
| `useAMCLPose.js` | Subscribes to `/amcl_pose`, returns `{px, py, qz, qw, rz}` (position x/y, quaternion z/w, roll z) |
| `useTeleop.js` | Publishes to `/web_teleop/cmd_vel` on demand, `stop()` sends zero velocity |
| `useMoveBase.js` | Publishes to `/move_base/goal` (move_base_msgs/MoveBaseActionGoal) with position + quaternion orientation |

### Helpers (src/helper/)
| File | Purpose |
|------|---------|
| `conditionalHelper.js` | Joins CSS class strings conditionally: `classes.filter(Boolean).join(' ')` |
| `angleHelper.js` | Converts Euler angles to quaternion: `eulerToQuaternion(angle)` |

### Pages (src/pages/)
| File | Purpose |
|------|---------|
| `Dashboard.jsx` | Placeholder ("Overview dashboard will be displayed here") |
| `Team.jsx` | Placeholder ("Team dashboard will be displayed here") |
| `Locations.jsx` | Placeholder ("Locations dashboard will be displayed here") |
| `Robots.jsx` | Main page: shows SkeletonRobot or [MapView + RobotView + AMCLPoseView + RobotControl + GoalSelector] |
| `config/routes.js` | `navLinks` array defining the navbar links |
| `config/mock-data.js` | `mockLocationList` array with named positions (x, y, angle) for GoalSelector |

---

## ROS Topics

| Topic | Type | Direction | Purpose |
|-------|------|-----------|---------|
| `/reference/map` | nav_msgs/OccupancyGrid | Subscribe | Occupancy grid map (width × height × data array) |
| `/camera/front/image_raw/compressed` | sensor_msgs/CompressedImage | Subscribe | Front camera feed (JPEG base64) |
| `/amcl_pose` | geometry_msgs/PoseWithCovarianceStamped | Subscribe | Robot localization pose (x, y, orientation quaternion) |
| `/web_teleop/cmd_vel` | geometry_msgs/Twist | Publish | Teleop velocity command (linear.x, angular.z) |
| `/move_base/goal` | move_base_msgs/MoveBaseActionGoal | Publish | Navigation goal (position + quaternion orientation) |

---

## UI Theme / Design

- **Background**: `bg-gray-900` (dark theme)
- **Text**: White primary, gray-400 secondary
- **Accent**: Indigo-500/600 for primary actions
- **Danger**: Red-500/600 for errors and disconnect
- **Connection indicator**: Green dot (connected) / Red dot (disconnected)
- **Component library**: Headless UI (modals, disclosures, buttons), MUI Skeleton for loading states

---

## Connection Flow (User Perspective)

1. User loads app → lands on Dashboard (disconnected)
2. Clicks **Connect** in navbar → `ConnectDialog` modal opens
3. Enters WebSocket URL (defaults to `ws://localhost:9090`) → clicks Connect
4. `RosProvider.connect()` creates `ROSLIB.Ros` instance
5a. **Success** → status turns green, URL shown, robots page shows map/camera/controls
5b. **Failure** → error dialog appears immediately with message, user can retry

---

## Key Implementation Details

### Map Rendering (MapView.jsx)
- Canvas is sized to `map.width × map.height` (ROS coordinates)
- Y-axis is flipped: ROS origin is bottom-left, canvas origin is top-left
- Cell values: -1 = unknown (grey), 0 = free (white), 1–100 = occupied (black, scaled 0–255)
- `imageRendering: pixelated` prevents blurring when canvas is scaled up

### Teleop (RobotControl.jsx)
- 3×3 grid: Q/W/E (forward-turn), A/S/D (turn-in-place/stop), Z/X/C (backward-turn)
- Keyboard: Q/W/E (forward with turn), A/S/D (turn/stop), Z/X/C (backward with turn)
- Hold key/button → immediately fires action, then repeats at 100ms interval
- Release → `stop()` sends zero velocity
- Mouse: `mousedown` starts, `mouseup`/`mouseleave` stops
- Touch: `touchstart` with `preventDefault`, `touchend` stops

### SkeletonRobot
- Uses MUI `<Skeleton variant="rectangular">` to mirror the actual Robots page layout
- Shows 3×3 skeleton grid (matching RobotControl buttons)
- Rendered when `!ros` (disconnected state)

### Error Dialog (Layout.jsx)
- Shown via `useEffect` when `connectionError` is not null
- `handleErrorClose` closes dialog and calls `clearError()`
- Uses same Headless UI Dialog component as ConnectDialog

---

## Running the App

```bash
cd D:/FYP/ros_tests/roslibjs/single_robot
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

---

## Git Context

- **Current branch**: `feature/single-goal`
- **Main branch**: `main`
- Recent commits: `Move to Goal`, `Setup`, `Removed unused files`, `Updated CLAUDE.md`, `Reconnection Logic Removal`

---

## Potential Future Work

- Add service calls (e.g., `/web_teleop/goal_pose`)
- Multiple robot support (currently single robot only)
- Dashboard page with robot fleet overview
- Persistent connection URL in localStorage
- Team/Locations pages implementation
- Map click-to-navigate or click-to-set-goal
