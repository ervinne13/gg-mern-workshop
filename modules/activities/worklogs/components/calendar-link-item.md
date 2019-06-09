# Building the Calendar Link Item

![Calendar Link Item](/img/calendar-link-item.png)

## Immersing into Atomic Design Development

We'll go in depth in this component to make the learners dive into how a component is developed from start to finish.

We won't do that with the succeeding components as we will be losing time as we will just do pretty much the same thing over and over, just different components.

## Creating the Component

This component (molecule in atomic design) can be broken down into 3 atoms.

- Day of Week
- Time Logged
- Day of Month (in ordinal format)

Let's first build a component that contains the three:

Create the new file `/src/App/Client/Features/Calendar/CalendarLinkItemComponent.jsx`:

```jsx
import React from 'react';
import './style.css';

const CalendarLinkItemComponent = ({ loggedMins, date }) => {
    const dateObj = new Date(date);

    return (
        <div className="calendar-link-item">
            <div className="calendar-link-item-content">
                <DayOfWeek date={ dateObj } />
                <TimeLogged loggedMins={ loggedMins } />
            </div>
            <DayOfMonth date={ dateObj} />
        </div>
    );
};
```

We're going to separate the three as `DayOfWeek`, `TimeLogged`, and `DayOfMonth` will all contain their own way of displaying their content.

Below the same file, let's create the `DayOfWeek` component.

```jsx
const DayOfWeek = ({ date }) => {
    //  check to see if this should be moved to a domain function later
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dateOfWeek = date.getDay();
    const weekDayText = weekdays[dateOfWeek];

    return (
        <span className="day-of-week">{ weekDayText }</span>
    );
};
```

The day of week should be able to display the day of week in text.

Below day of week, add in:

```jsx
const TimeLogged = ({ loggedMins }) => {    
    const hours = Math.floor(loggedMins / 60);
    const remMins = Math.round(loggedMins - (hours * 60));

    const hoursDisplay = `${hours} Hours`;
    const minsDisplay = remMins ? `${remMins} Minutes` : ''

    return (
        <span className="time-logged">{ hoursDisplay } { minsDisplay } Logged</span>
    );
};
```

For our `DayOfMonth` component, we'll need first a function that can display the ordinal of a number. Let's write one in the same file and just comment a TODO: Check...

```jsx
/**
 * TODO: Check if this should be moved to domain later
 */
const getOrdinal = (number) => {
    if (number > 3 && number < 21) return 'th'; 
    switch (number % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
};
```

We can now concentrate on developing the actual component:

```jsx
const DayOfMonth = ({ date }) => {
    const dateOfMonth = date.getDate();
    const displayText = `${dateOfMonth}${getOrdinal(dateOfMonth)}`;

    return (
        <span className="day-of-month">{ displayText }</span>
    );
}
```

Finally, we must make the parent component exportable:

```jsx
export default CalendarLinkItemComponent;
```

Check your browser and you should now see the components in action:

![UI Library Progress 1](/img/ui-library-01.png)

## Styling the Component

Now we must add css to our component. We can just add new CSS classes in our `index.css` but that's not really the recommended practice.

What we can do is create a separate `style.css` for each component that needs it. This will also make it more efficient when we finally enable "code splitting" in our project.

But how do we implement it in a way that would generate the least (ideally zero) effect to the users of the component.

We can make use of "directory descriptors" and change the CalendarLinkItemComponent into a folder and create a "directory descriptor" to direct the imports to a configured jsx component.

### Implementing Directory Descriptors

Create a new folder `CalendarLinkItemComponent` inside `/src/App/Client/Features/Calendar/` then copy the `CalendarLinkItemComponent.jsx` component in there.

We'll then create a file in the same directory called `package.json` with the content:

```json
{
    "main": "./CalendarLinkItemComponent.jsx"
}
```

And another file called `style.css` to contain our styling.

Ultimately, your folder structure should be like below:

![CalendarLinkItemComponent Structure](/img/CalendarLinkItemComponent-structure.png)

Directory descriptors may not be read right away by CRA so restart your webpack dev server.

Notice that even if we don't change anything in the `UILibrary` scene/component, everything should still work the same way.

## Styling the Component

Follow along the instructor as he demonstrates how to make use of our XD file to checkout the styling of each element.

Based on the XD file, the component would have a padding of 14px on top and bottom and about 36px left and 22px to the right. In CSS, that would be:

```css
.calendar-link-item {
    padding-top: 14px;
    padding-bottom: 14px;

    padding-left: 36px;
    padding-right: 22px;
}
```

Checkout the box model of `.calendar-link-item-content`. Its taking up all the space in the container. We can change this by telling css to display the component `inline-block` basically treating each blocks inside that selector to be inline instead of consuming everything horizontally:

```css
.calendar-link-item-content {
    display: inline-block;
}
```

Follow long the instructor as he inspects the XD file to get the styling of the day of week:

```css
.calendar-link-item-content > .day-of-week {    
    font-size: 22px;
    font-weight: semibold;
}
```

... now it should look something like:

![UI Library Progress 2](/img/ui-library-02.png)

Follow long the instructor as he inspects the XD file to get the styling of the day of week:

```css
.calendar-link-item-content > .time-logged {    
    font-size: 18px;
}
```

... now the time logged should be bigger and should look like:

![UI Library Progress 3](/img/ui-library-03.png)

Everything is aligned though. We want both the day of week and the time logged be in their own lines. This is because the style `display: inline-block` we set earlier is cascading into these components. We can revert that by specifying `display: block` in each element so that they now consume all the horizontal space in again.

Add `display: block;` to both `.day-of-week` and `.time-logged` and both should look like below:

```css
.calendar-link-item-content > .day-of-week {
    display: block;
    font-size: 22px;
    font-weight: semibold;
}

.calendar-link-item-content > .time-logged {
    display: block;
    font-size: 18px;
}
```

Looking at our browser:

![UI Library Progress 4](/img/ui-library-04.png)

Nice! Now we just have to display the day of month to the right and apply the appropriate styling.

Displaying it to the right is easy, just add `float` to it:

```css
.calendar-link-item > .day-of-month {
    float: right;
}
```

![UI Library Progress 5](/img/ui-library-05.png)

Now we just have to get the style from XD, update `.day-of-month` to:

```css
.calendar-link-item > .day-of-month {
    float: right;
    font-size: 42px;
    font-weight: bold;

    color: #8D8D8D;
}
```

Now we've finally achieved our intended UI:

![UI Library Progress 6](/img/ui-library-06.png)