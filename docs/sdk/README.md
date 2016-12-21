# SDK

This section contains all information about the sdk-related packages.

> If you are looking to migrate from the `sphere-node-sdk` package, please read the [migration guide](/docs/sdk/upgrading-from-sphere-node-sdk.md).


## Design architecture

The SDK is now split into multiple little packages, think about it as a *microservice* architecture. This is by choice and it provides several different advantages:
- flexibility: choose the packages that fits best your use case
- extensibility: developers can potentially build their own packages to extend / replace pieces of the SDK packages (e.g. custom [middlewares](/docs/sdk/Middlewares.md))
- maintainability: easier to maintain each single little package instead of one big library. This is also one of the reasons to use a [monorepo](https://github.com/lerna/lerna)

The core of the SDK lies within its [middlewares](/docs/sdk/Middlewares.md) implementation.
Middlewares do specific things and can be replaced by other middlewares depending on the use case, allowing many possible combinations.

The SDK *client* itself is in fact really simple and somehow even agnostic of the specific commercetools platform API that can be used as a generic HTTP client.

If we take a step back and look at the general requirement, at the end we simply want to **execute a request**. It just happens to be that we want to make specific requests to the commercetools platform API but it might be as well any other API. That's where the [middlewares](/docs/sdk/Middlewares.md) come in, which provide the *side effects* of the given request.
