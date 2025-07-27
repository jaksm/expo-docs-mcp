---
title: Expo UI
sidebar_title: UI
description: A set of components that allow you to build UIs directly with SwiftUI and Jetpack Compose from React.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-53/packages/expo-ui
packageName: @expo/ui
platforms: ["android", "ios"]
isAlpha: true
---

{/* import APISection from '~/components/plugins/APISection'; */}

> **important** **This library is currently in alpha and will frequently experience breaking changes.** It is not available in the Expo Go app &ndash; use [development builds](/develop/development-builds/introduction/) to try it out.

`@expo/ui` is a set of native input components that allows you to build fully native interfaces with SwiftUI and Jetpack Compose. It aims to provide the commonly used features and components that a typical app will need.

## Installation

## Swift UI examples

### BottomSheet

<Tab label="iOS">
  
</Tab>

<Tab label="Code">
```tsx

<BottomSheet isOpened={isOpened} onIsOpenedChange={e => setIsOpened(e)}>
  <Text>Hello, world!</Text>
</BottomSheet>
```
  *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/view/sheet(ispresented:ondismiss:content:))*
</Tab>

### Button

<Tab label="iOS">

</Tab>
<Tab label="Code">
```tsx

<Button
  style={{ flex: 1 }}
  variant="default"
  onPress={() => {
    setEditingProfile(true);
  }}>
  Edit profile
</Button>
```
  *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/button)*
</Tab>

### CircularProgress

  <Tab label="iOS">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { CircularProgress } from '@expo/ui/swift-ui';

    
    ```
    *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/progressview)*

  </Tab>

### ColorPicker

<Tab label="iOS">
  
</Tab>

<Tab label="Code">
```tsx

```
  *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/colorpicker)*
</Tab>

### ContextMenu

> **Note:** Also known as **DropdownMenu**.

  <Tab label="iOS">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { ContextMenu } from '@expo/ui/swift-ui';

    <ContextMenu style={{ width: 150, height: 50 }}>
      <ContextMenu.Items>
        <Button
          systemImage="person.crop.circle.badge.xmark"
          onPress={() => console.log('Pressed1')}>
          Hello
        </Button>
        <Button
          variant="bordered"
          systemImage="heart"
          onPress={() => console.log('Pressed2')}>
          Love it
        </Button>
        <Picker
          label="Doggos"
          options={['very', 'veery', 'veeery', 'much']}
          variant="menu"
          selectedIndex={selectedIndex}
          onOptionSelected={({ nativeEvent: { index } }) => setSelectedIndex(index)}
        />
      </ContextMenu.Items>
      <ContextMenu.Trigger>
        <Button variant="bordered" style={{ width: 150, height: 50 }}>
          Show Menu
        </Button>
      </ContextMenu.Trigger>
    </ContextMenu>
    ```
    *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/view/contextmenu(menuitems:))*

  </Tab>

### DateTimePicker (date)

<Tab label="iOS">

</Tab>
<Tab label="Code">
```tsx

<DateTimePicker
  onDateSelected={date => {
    setSelectedDate(date);
  }}
  displayedComponents='date'
  initialDate={selectedDate.toISOString()}
  variant='wheel'
/>
```
  *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/datepicker)*
</Tab>

### DateTimePicker (time)

  <Tab label="iOS">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { DateTimePicker } from '@expo/ui/swift-ui';

    <DateTimePicker
      onDateSelected={date => {
        setSelectedDate(date);
      }}
      displayedComponents='hourAndMinute'
      initialDate={selectedDate.toISOString()}
      variant='wheel'
    />
    ```
    *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/datepicker)*

  </Tab>

### Gauge

<Tab label="iOS">

</Tab>

<Tab label="Code">
```tsx

```
  *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/gauge)*
</Tab>

### LinearProgress

<Tab label="iOS">

</Tab>
<Tab label="Code">
```tsx

```
  *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/progressview)*
</Tab>

### List

  <Tab label="iOS">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { List } from '@expo/ui/swift-ui';

    <List
      scrollEnabled={false}
      editModeEnabled={editModeEnabled}
      onSelectionChange={(items) => alert(`indexes of selected items: ${items.join(', ')}`)}
      moveEnabled={moveEnabled}
      onMoveItem={(from, to) => alert(`moved item at index ${from} to index ${to}`)}
      onDeleteItem={(item) => alert(`deleted item at index: ${item}`)}
      style={{ flex: 1 }}
      listStyle='automatic'
      deleteEnabled={deleteEnabled}
      selectEnabled={selectEnabled}>
      {data.map((item, index) => (
        
      ))}
    </List>
    ```
    *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/list)*

  </Tab>

### Picker (segmented)

<Tab label="iOS">

</Tab>
<Tab label="Code">
```tsx

  <Picker
    options={['$', '$$', '$$$', '$$$$']}
    selectedIndex={selectedIndex}
    onOptionSelected={({ nativeEvent: { index } }) => {
      setSelectedIndex(index);
    }}
    variant="segmented"
  />
  ```
  *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/picker#Styling-pickers)*
  </Tab>

### Picker (wheel)

<Tab label="iOS">

</Tab>
<Tab label="Code">
```tsx

<Picker
  options={['$', '$$', '$$$', '$$$$']}
  selectedIndex={selectedIndex}
  onOptionSelected={({ nativeEvent: { index } }) => {
    setSelectedIndex(index);
  }}
  variant="wheel"
  style={{
    height: 100,
  }}
/>
```
  *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/pickerstyle/wheel)*
</Tab>

### Slider

  <Tab label="iOS">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { Slider } from '@expo/ui/swift-ui';

    <Slider
      style={{ minHeight: 60 }}
      value={value}
      onValueChange={(value) => {
        setValue(value);
      }}
    />
    ```
    *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/slider)*

  </Tab>

### Switch (toggle)

> **Note:** Also known as **Toggle**.

<Tab label="iOS">

</Tab>
<Tab label="Code">
```tsx

<Switch
  checked={checked}
  onValueChange={checked => {
    setChecked(checked);
  }}
  color="#ff0000"
  label="Play music"
  variant="switch"
/>
```
  *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/toggle)*
</Tab>

### Switch (checkbox)

<Tab label="iOS">

</Tab>
<Tab label="Code">
```tsx

<Switch
  checked={checked}
  onValueChange={checked => {
    setChecked(checked);
  }}
  label="Play music"
  variant="checkbox"
/>
```
  *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/toggle)*
</Tab>

### TextInput

  <Tab label="iOS">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { TextInput } from '@expo/ui/swift-ui';

    
    ```
    *See also: [official SwiftUI documentation](https://developer.apple.com/documentation/swiftui/textfield)*

  </Tab>

## Jetpack Compose examples

### Button

<Tab label="Android">

</Tab>
<Tab label="Code">
```tsx

<Button
  style={{ flex: 1 }}
  variant="default"
  onPress={() => {
    setEditingProfile(true);
  }}>
  Edit profile
</Button>
```
*See also: [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/components/button)*
</Tab>

### CircularProgress

  <Tab label="Android">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { CircularProgress } from '@expo/ui/jetpack-compose';

    
    ```
    *See also: [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/components/progress)*

  </Tab>

### ContextMenu

> **Note:** Also known as **DropdownMenu**.

  <Tab label="Android">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { ContextMenu } from '@expo/ui/jetpack-compose';

    <ContextMenu style={{ width: 150, height: 50 }}>
      <ContextMenu.Items>
        <Button
          elementColors={{ containerColor: '#0000ff', contentColor: '#00ff00' }}
          onPress={() => console.log('Pressed1')}>
          Hello
        </Button>
        <Button
          variant="bordered"
          color="#ff0000"
          onPress={() => console.log('Pressed2')}>
          Love it
        </Button>
        <Picker
          label="Doggos"
          options={['very', 'veery', 'veeery', 'much']}
          variant="menu"
          selectedIndex={selectedIndex}
          onOptionSelected={({ nativeEvent: { index } }) => setSelectedIndex(index)}
        />
      </ContextMenu.Items>
      <ContextMenu.Trigger>
        <Button variant="bordered" style={{ width: 150, height: 50 }}>
          Show Menu
        </Button>
      </ContextMenu.Trigger>
    </ContextMenu>
    ```
    *See also: [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/components/menu)*

  </Tab>

### DateTimePicker (date)

<Tab label="Android">

</Tab>
<Tab label="Code">
```tsx

<DateTimePicker
  onDateSelected={date => {
    setSelectedDate(date);
  }}
  displayedComponents='date'
  initialDate={selectedDate.toISOString()}
  variant='picker'
/>
```
  *See also: [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/components/datepickers)*
</Tab>

### DateTimePicker (time)

  <Tab label="Android">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { DateTimePicker } from '@expo/ui/jetpack-compose';

    <DateTimePicker
      onDateSelected={date => {
        setSelectedDate(date);
      }}
      displayedComponents='hourAndMinute'
      initialDate={selectedDate.toISOString()}
      variant='picker'
    />
    ```
    *See also: [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/components/time-pickers)*

  </Tab>

### LinearProgress

  <Tab label="Android">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { LinearProgress } from '@expo/ui/jetpack-compose';

    
    ```
    *See also: [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/components/progress)*

  </Tab>

### Picker (radio)

  <Tab label="Android">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { Picker } from '@expo/ui/jetpack-compose';

    <Picker
      options={['$', '$$', '$$$', '$$$$']}
      selectedIndex={selectedIndex}
      onOptionSelected={({ nativeEvent: { index } }) => {
        setSelectedIndex(index);
      }}
      variant="radio"
    />
    ```
    *See also: [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/components/radio-button)*

  </Tab>

### Picker (segmented)

<Tab label="Android">

</Tab>
<Tab label="Code">
```tsx

<Picker
  options={['$', '$$', '$$$', '$$$$']}
  selectedIndex={selectedIndex}
  onOptionSelected={({ nativeEvent: { index } }) => {
    setSelectedIndex(index);
  }}
  variant="segmented"
/>
```
  *See also: [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/components/segmented-button)*
</Tab>

### Slider

  <Tab label="Android">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { Slider } from '@expo/ui/jetpack-compose';

    <Slider
      style={{ minHeight: 60 }}
      value={value}
      onValueChange={(value) => {
        setValue(value);
      }}
    />
    ```
    *See also: [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/components/slider)*

  </Tab>

### Switch (toggle)

> **Note:** Also known as **Toggle**.

  <Tab label="Android">
    

  </Tab>
  <Tab label="Code">
    ```tsx
    import { Switch } from '@expo/ui/jetpack-compose';

    <Switch
      value={checked}
      onValueChange={checked => {
        setChecked(checked);
      }}
      color="#ff0000"
      label="Play music"
      variant="switch"
    />
    ```
    *See also: [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/components/switch)*

  </Tab>

### Switch (checkbox)

  <Tab label="Android">
    

  </Tab>
  <Tab label="Code">
    ```tsx
    import { Switch } from '@expo/ui/jetpack-compose';

    <Switch
      value={checked}
      onValueChange={checked => {
        setChecked(checked);
      }}
      label="Play music"
      color="#ff0000"
      variant="checkbox"
    />
    ```
    *See also: [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/components/checkbox)*

  </Tab>

### TextInput

  <Tab label="Android">
    
  </Tab>
  <Tab label="Code">
    ```tsx
    import { TextInput } from '@expo/ui/jetpack-compose';

    
    ```
    *See also: [official Jetpack Compose documentation](https://developer.android.com/develop/ui/compose/text/user-input)*

  </Tab>

## API

Full documentation is not yet available. Use TypeScript types to explore the API.

```ts
// Import from the SwiftUI package

```

```ts
// Import from the Jetpack Compose package

```

{/*  */}