
export function watchPropORStateChanges(componentLabel: string, prevProps: any, prevState: any, currProps: any, currState: any) {
  for (const k in prevProps) {
    if (prevProps[k] !== currProps[k]) {
      console.log(`[${componentLabel}] props: ${k} changed!`, prevProps[k], '==>', currProps[k]);
    }
  }
  for (const k in prevState) {
    if (prevState[k] !== currState[k]) {
      console.log(`[${componentLabel}] state: ${k} changed!`, prevState[k], '==>', currState[k]);
    }
  }
}

// componentWillUpdate(prevProps: any, prevState: any) {
//   watchPropORStateChanges('App', prevProps, prevState, this.props, this.state);
// }
