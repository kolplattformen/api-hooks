import { Child, EtjanstChild, Skola24Child } from '@skolplattformen/embedded-api'

// eslint-disable-next-line import/prefer-default-export
export const merge = (etjanstChildren: EtjanstChild[], skola24Children: Skola24Child[]): Child[] => (
  etjanstChildren.map((etjanstChild) => {
    const skola24Child: Skola24Child = (
      skola24Children.find((s24c) => s24c.firstName && etjanstChild.name.startsWith(s24c.firstName)) || {}
    )
    const child: Child = {
      ...etjanstChild,
      ...skola24Child,
    }
    return child
  })
)
