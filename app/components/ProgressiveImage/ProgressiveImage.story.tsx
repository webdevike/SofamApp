import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { ProgressiveImage } from "./ProgressiveImage"

declare var module

storiesOf("ProgressiveImage", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <ProgressiveImage text="ProgressiveImage" />
      </UseCase>
    </Story>
  ))
