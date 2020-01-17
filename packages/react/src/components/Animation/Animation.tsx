import {
  getElementType,
  getUnhandledProps,
  unstable_createAnimationStyles as createAnimationStyles,
  unstable_getStyles as getStyles,
} from '@fluentui/react-bindings'
import { ICSSInJSStyle } from '@fluentui/styles'
import cx from 'classnames'
import * as PropTypes from 'prop-types'
import * as React from 'react'
// @ts-ignore
import { ThemeContext } from 'react-fela'

import {
  childrenExist,
  ChildrenComponentProps,
  commonPropTypes,
  StyledComponentProps,
} from '../../utils'
import { ProviderContextPrepared, WithAsProp, withSafeTypeForAs } from '../../types'

export interface AnimationProps
  extends StyledComponentProps,
    ChildrenComponentProps<React.ReactChild> {
  /** An element type to render as (string or function). */
  as?: any

  /** Additional CSS class name(s) to apply.  */
  className?: string

  /** The name for the animation that should be applied, defined in the theme. */
  name?: string

  /** Specifies a delay for the start of an animation. Negative values are
   * also allowed. If using negative values, the animation will start as if it had already been
   * playing for that amount of time.
   */
  delay?: string

  /** Specifies whether an animation should be played forwards, backwards or in alternate cycles.
   * It can have the following values:
   * - normal (default) - The animation is played as normal (forwards)
   * - reverse - The animation is played in reverse direction (backwards)
   * - alternate - The animation is played forwards first, then backwards
   * - alternate-reverse - The animation is played backwards first, then forwards
   */
  direction?: string

  /** Specifies how long an animation should take to complete. */
  duration?: string

  /**
   * Specifies a style for the target element when the animation is not playing (i.e. before it starts, after it ends, or both).
   * It can have the following values:
   * - none (default) - Animation will not apply any styles to the element before or after it is executing
   * - forwards - The element will retain the style values that is set by the last keyframe (depends on animation-direction and animation-iteration-count)
   * - backwards - The element will get the style values that is set by the first keyframe (depends on animation-direction), and retain this during the animation-delay period
   * - both - The animation will follow the rules for both forwards and backwards, extending the animation properties in both directions
   * */
  fillMode?: string

  /** Specifies the number of times an animation should run. */
  iterationCount?: string

  /** Custom parameters for the keyframe defined for the animation. */
  keyframeParams?: object

  /**
   * Specifies whether the animation is running or paused. It can have the following values:
   * - paused - Specifies that the animation is paused
   * - running - Default value. Specifies that the animation is running
   * - initial - Sets this property to its default value.
   * - inherit - Inherits this property from its parent element.
   * */
  playState?: string

  /**
   * Specifies the speed curve of the animation. It can have the following values:
   * - ease - Specifies an animation with a slow start, then fast, then end slowly (this is default)
   * - linear - Specifies an animation with the same speed from start to end
   * - ease-in - Specifies an animation with a slow start
   * - ease-out - Specifies an animation with a slow end
   * - ease-in-out - Specifies an animation with a slow start and end
   * - cubic-bezier(n,n,n,n) - Lets you define your own values in a cubic-bezier function
   */
  timingFunction?: string
}

const Animation: React.FC<WithAsProp<AnimationProps>> & {
  className: string
  handledProps: string[]
} = props => {
  const {
    children,
    className,
    name,
    delay,
    direction,
    duration,
    fillMode,
    iterationCount,
    keyframeParams,
    playState,
    timingFunction,
  } = props

  const context: ProviderContextPrepared = React.useContext(ThemeContext)
  const ref = React.useRef(null)

  const animationStyles: ICSSInJSStyle = createAnimationStyles(
    {
      name,
      keyframeParams,
      duration,
      delay,
      iterationCount,
      direction,
      fillMode,
      playState,
      timingFunction,
    },
    context.theme,
  )

  const { classes } = getStyles({
    disableAnimations: context.disableAnimations,
    displayName: Animation.displayName,
    props: {
      styles: animationStyles,
    },
    renderer: context.renderer,
    rtl: context.rtl,
    saveDebug: fluentUIDebug => (ref.current = { fluentUIDebug }),
    theme: context.theme,
    _internal_resolvedComponentVariables: context._internal_resolvedComponentVariables,
  })

  const ElementType = getElementType(props)
  const unhandledProps = getUnhandledProps(Animation.handledProps /* TODO fix any */ as any, props)

  const child =
    childrenExist(children) && (React.Children.only(children) as React.ReactElement<any>)
  const result = child
    ? React.cloneElement(child, {
        className: cx(child.props.className, classes.root),
      })
    : ''

  return (
    <ElementType
      className={cx(Animation.className, className)}
      style={{ display: 'inline-block' }}
      {...unhandledProps}
    >
      {result}
    </ElementType>
  )
}

Animation.className = 'ui-animation'
Animation.displayName = 'Animation'
Animation.propTypes = {
  ...commonPropTypes.createCommon({
    accessibility: false,
    content: false,
    children: 'element',
  }),
  children: PropTypes.element,
  name: PropTypes.string,
  delay: PropTypes.string,
  direction: PropTypes.string,
  duration: PropTypes.string,
  fillMode: PropTypes.string,
  iterationCount: PropTypes.string,
  keyframeParams: PropTypes.object,
  playState: PropTypes.string,
  timingFunction: PropTypes.string,
}
Animation.handledProps = Object.keys(Animation.propTypes)

/**
 * An Animation provides animation effects to rendered elements.
 */
export default withSafeTypeForAs<typeof Animation, AnimationProps>(Animation)
