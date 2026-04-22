# ROS Web Interface

React 19 + Vite, Tailwind CSS, ROSLIB, React Router — web interface for robot control via ROS bridge.

## Tech Stack

- **Frontend**: React 19, React Router 7, Tailwind CSS 4
- **Build**: Vite
- **ROS**: roslib 2.1 (WebSocket bridge)

## Architecture

### State Management

`ROSProvider` context wraps the app, managing WebSocket connections to ROS bridge.

```jsx
// useRos() returns:
{ ros, status, url, connect, disconnect }
```

### Routing

4 routes under a shared `Layout`:

| Route | Page | Purpose |
|-------|------|---------|
| `/dashboard` | Dashboard | Landing page |
| `/team` | Team | Placeholder |
| `/robots` | Robots | Main control interface |
| `/locations` | Locations | Placeholder |

### Robots Page Layout

When `ros` is connected, renders:

```
┌─────────────────────────────────────────┐
│ MapView        │ RobotView              │
│                │ AMCLPoseView          │
├────────────────┴───────────────────────┤
│ RobotControl (teleop)                   │
└────────────────────────────────────────┘
```

## Connection Flow

1. User clicks **Connect** → `ConnectDialog` modal opens
2. User enters WebSocket URL (default: `ws://localhost:9090`)
3. `RosProvider.connect(url)` creates `ROSLIB.Ros` instance
4. On success: `ros` state set, UI shows green "Connected"
5. On disconnect/error: auto-retry up to 5 times with 3s delay

## File Structure

```
src/
├── App.jsx                      # Router setup
├── components/
│   ├── Layout.jsx              # Navbar + connection status
│   ├── ConnectDialog.jsx       # ROS bridge URL input modal
│   ├── MapView.jsx             # Robot map display
│   ├── RobotView.jsx           # Robot status
│   ├── AMCLPoseView.jsx        # AMCL localization pose
│   ├── RobotControl.jsx        # Teleoperation controls
│   └── SkeletonPage.jsx        # Loading placeholder
├── hooks/ROS/
│   ├── ROSContext.js           # Context definition
│   ├── ROSProvider.jsx         # Connection logic + retry
│   ├── useROS.js               # useRos() hook
│   ├── useAMCLPose.js          # AMCL topic subscription
│   ├── useMap.js               # Map topic subscription
│   └── useTeleop.js            # Velocity publisher
├── pages/
│   ├── Dashboard.jsx
│   ├── Team.jsx
│   ├── Locations.jsx
│   ├── Robots.jsx
│   └── config/
│       ├── routes.js           # navLinks definition
│       ├── robots.js           # Robot list (1 robot: Pangolin)
│       └── settings.js
```

## Key Files

- `ROSProvider.jsx` — WebSocket connection, auto-retry logic
- `Layout.jsx` — Connection status indicator + Connect/Disconnect button
- `ConnectDialog.jsx` — URL input form
- `robots.js` — Single robot config: name "Pangolin", ws://localhost:9090
