import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { ErrorFallback } from "./ErrorFallback"

declare var module

storiesOf("ErrorFallback", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <ErrorFallback text="ErrorFallback" />
      </UseCase>
    </Story>
  ))
