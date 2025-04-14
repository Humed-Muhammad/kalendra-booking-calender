# KalendraCalendar React Component

`KalendraCalendar` is a customizable calendar component built for managing events with features such as user-specific responses, session management, and error handling. This component can be used in any React-based project and allows seamless integration with your application's back-end to manage event data and user interactions.

## Installation

To install the package, use npm or yarn:

```bash
npm install kalendra
# or
yarn add kalendra
```

## Usage

Below is an example of how to use the `KalendraCalendar` component in your React application.

### Importing the Component

```tsx
import { KalendraCalendar } from "kalendra";
```

### Example Usage

```tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { KalendraCalendar } from "kalendra"; // Import the component
import { parentActions } from "./store/actions"; // Replace with actual path to your actions
import { showToast } from "./utils"; // Replace with your toast notification utility
import { uuid4 } from "uuid"; // Make sure to install uuid library

const CalendarExample = ({
  theme,
  event_type_id,
  kalendra_user_id,
  userInfo,
  metadata,
  duration,
  user,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <KalendraCalendar
      styles={{
        border: theme.borders[1],
        borderRadius: theme.radii[1],
      }}
      eventTypeId={event_type_id}
      kalendra_user_id={kalendra_user_id}
      onSuccess={() => {
        setIsSuccess(true);
        dispatch(parentActions.getTherapyInfo() as any); // Dispatch your custom action
        navigate?.(); // Navigate after success
      }}
      onError={(error) => {
        console.log(error);
        showToast({
          message: "Something went wrong",
          type: "error",
        });
      }}
      responses={{
        name: userInfo?.user?.full_name || userInfo?.full_name || "",
        email: userInfo?.user?.email || userInfo?.email || "",
        "db-email": userInfo?.user?.email || userInfo?.email || "",
        "profile-id": userInfo?.id || "",
        "phone-number": userInfo?.user?.phone_number || user.phone_number || "",
        "recording-consent-metadata": JSON.stringify(metadata || {}),
        session_uuid: uuid4(),
      }}
      duration={duration}
    />
  );
};

export default CalendarExample;
```

### Props

The `KalendraCalendar` component accepts the following props:

- `styles` (object) - Custom CSS styles for the calendar component (optional).
  - Example: `{ border: '1px solid #ccc', borderRadius: '8px' }`
- `eventTypeId` (string) - The ID of the event type to be displayed in the calendar from the kalendra event types you created.
- `kalendra_user_id` (string) - The unique user ID associated with the kalendra user.
- `onSuccess` (function) - Callback function to be executed when the event is successfully added or processed.
- `onError` (function) - Callback function to be executed when there is an error during the event handling.
- `responses` (object) - To auto populate event questions if you have any.
  - Example:
    ```js
    {
      name: 'John Doe',
      email: 'johndoe@example.com',
      'profile-id': '123456',
      'phone-number': '555-555-5555',
      session_uuid: 'uuid4-generated-id',
      'recording-consent-metadata': '{}'
    }
    ```
- `duration` (number) - Duration of the event in minutes (optional) used to auto populate the event duration.

### Example of `responses` Object:

The `responses` object should contain necessary user and event data. It could look like this:

```js
responses={{
  name: userInfo?.user?.full_name || userInfo?.full_name || '',
  email: userInfo?.user?.email || userInfo?.email || '',
  'db-email': userInfo?.user?.email || userInfo?.email || '',
  'profile-id': userInfo?.id || '',
  'phone-number': userInfo?.user?.phone_number || user.phone_number || '',
  'recording-consent-metadata': JSON.stringify(metadata || {}),
  session_uuid: uuid4(),
}}
```

### Success and Error Callbacks

The `onSuccess` and `onError` callbacks allow you to handle the outcome of the calendar interaction:

- `onSuccess`: Triggered when the calendar operation completes successfully. It’s a good place to dispatch state updates or trigger side effects like navigation.
- `onError`: Triggered if something goes wrong. You can use this callback to show an error message or handle any failures gracefully.

### Example of `onSuccess` Usage:

```tsx
onSuccess={() => {
  setIsSuccess(true);
  dispatch(parentActions.getTherapyInfo() as any);
  navigate?.();
}}
```

### Example of `onError` Usage:

```tsx
onError={(error) => {
  console.log(error);
  showToast({
    message: 'Something went wrong',
    type: 'error',
  });
}}
```

## Additional Notes

- The `styles` prop allows for full customization of the calendar's border and radius using your app's theme. Simply pass an object with the desired CSS properties.
- `duration` should be passed as a number representing the duration of the event in minutes.
- Make sure to manage the state and the responses object dynamically depending on the user's data or application context.

## Dependencies

- `uuid`: Ensure you have the `uuid` library installed for generating unique session IDs.

  ```bash
  npm install uuid
  # or
  yarn add uuid
  ```

- `react-redux`: Used for dispatching actions (if you're using Redux).

  ```bash
  npm install react-redux
  # or
  yarn add react-redux
  ```

- `react-router-dom`: For navigation handling, if your application uses it.
  ```bash
  npm install react-router-dom
  # or
  yarn add react-router-dom
  ```

## License

This software is under a **Commercial Software License**.

You **cannot** use this library in commercial projects, paid products, or SaaS platforms without a valid commercial license.

📩 For licensing and inquiries, contact: humedessie@gmail.com  
📄 See the full license in the [LICENSE](./LICENSE) file.
