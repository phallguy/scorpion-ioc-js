Add IoC to TypeScript projects in node with minimal fuss and ceremony.

[![Package Version](https://badge.fury.io/js/scorpion-ioc.svg)](https://www.npmjs.com/package/scorpion-ioc)
[![GitHub version](https://badge.fury.io/gh/phallguy%2Fscorpion-ioc-js.svg)](https://badge.fury.io/gh/phallguy%2Fscorpion-ioc-js)
[![Circle CI](https://circleci.com/gh/phallguy/scorpion-ioc-js.svg?style=svg)](https://circleci.com/gh/phallguy/scorpion-ioc-js)

<!-- vim-markdown-toc GFM -->

* [Dependency Injection](#dependency-injection)
  * [Why might you _Want_ a DI FRamework?](#why-might-you-_want_-a-di-framework)
    * [Property/Default Injection](#propertydefault-injection)
    * [Constructor/Ignorant Injection](#constructorignorant-injection)
  * [Using a Framework...like Scorpion](#using-a-frameworklike-scorpion)
* [Getting Started](#getting-started)
* [Using Scorpion](#using-scorpion)
  * [Decoration](#decoration)
  * [Configuration](#configuration)
    * [Builders](#builders)
    * [Singletons and Object Lifetimes](#singletons-and-object-lifetimes)
    * [Nests](#nests)
  * [Contributing](#contributing)
  * [License](#license)

<!-- vim-markdown-toc -->

# Dependency Injection

Dependency injection helps to break explicit dependencies between objects making
it much easier to maintain a [single
responsibility](https://en.wikipedia.org/wiki/Single_responsibility_principle)
and reduce [coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming))
in our class designs. This leads to more testable code and code that is more
resilient to change.

Most arguments for or against DI focus on testing, and given how easy it is to
mock objects in JavaScript, you don't really need a framework. If testing were the
only virtue they'd be spot on. Despite its virtues DI doesn't come without its
own problems. However for larger projects that you expect to be long-lived, a DI
framework may help manage the complexity.

For a deeper background on Dependency Injection consider the
[Wikipedia](https://en.wikipedia.org/wiki/Dependency_injection) article on the
subject.

## Why might you _Want_ a DI FRamework?

Assuming you've embraced the general concept of DI why would you want to use a
framework. Lets consider the alternatives.

### Property/Default Injection

```typescript
class Hunter {
  private weapon: Weapon = new Weapon()
}
```

In this scenario the Hunter class knows how to create a weapon and provides a
sane default, but allows the dependency to be overridden if needed.

**PROS**

- Very simple to understand and debug.
- Provides basic flexibility.
- The dependency is clearly defined.

**CONS**

- Still coupled to a specific _type_ of Weapon.
- If multiple classes use this approach and you decide to upgrade your armory,
  you'd have to modify every line that creates new weapons. The factory pattern
  can be used to solve that problem.
- No global method of replacing a Weapon class with a specialized or
  instrumented version. For example a ThreadLockedWeapon.

### Constructor/Ignorant Injection

```typescript
class Hunter {
  constructor( private readonly weapon: Weapon ) {}
}
```

Here Hunters can use any weapon and can be designed to an interface Weapon that
does not have an implementation yet.

**PROS**

- Provides flexibility
- Work can proceed concurrently on Hunter and Weapon classes by different
  engineers  on the team.

**CONS**

- Hard to reason about Hunters and Weapons as a whole.
- It pushes the responsibility of constructing dependencies onto the consumer of
  the class. If the class is used in multiple places this becomes a maintenance
  chore when changes are required.
- It becomes tedious to use classes resulting in repeated boilerplate code that
  distracts from the primary responsibility of the calling code.


## Using a Framework...like Scorpion

Using a good framework preserves the benefits of each method while minimizing
the cons. A DI framework works like an automatic factory system resolving
dependencies cleanly like a factory but without all the effort to create custom
factories.

A good framework should

- Make dependencies clear
- Require a minimal amount of configuration or ceremony

```typescript
class Hunter {
  // Must await to access injected resource
  @Inject private weapon?: Promise<Weapon>

  // or use constructor that always receives resolved instances
  constructor( @Inject private weapon: Weapon ) {}
}
```

Here the dependency is clearly defined - and even creates accessors for getting
and setting the weapon. When a Hunter is created its dependencies are also
created - and any of their dependencies and so on. Usage is equally simple

```typescript
const hunter = await scorpion.fetch( Hunter )
hunter.weapon   // => a Weapon
```

Overriding the kind of weapons used by hunters.

```typescript
class Axe extends Weapon {}

scorpion.prepare(map => {
  map.bind(Axe)
})

hunter = await scorpion.fetch( Hunter )
hunter.weapon // => an Axe
```

Overriding hunters!

```typescript
class Axe extends Weapon {}
class Predator extends Hunter {}

scorpion.prepare(map => {
  map.bind(Predator)
  map.bind(Axe)
})

hunter = await scorpion.fetch( Hunter )
hunter        // => Predator
hunter.weapon // => an Axe
```

# Getting Started

Add scorpion to your project

```
npm install scorpion-ioc

# or using yarn
yarn add scorpion-ioc
```

# Using Scorpion

Out of the box Scorpion does not need any configuration and will work
immediately. You can hunt for any Class even if it hasn't been configured.

```typescript
  const now = await scorpion.fetch( Date )
  now // => Date
```

## Decoration

Scorpions feed their prey - any object that should be fed its dependencies when
it is created. Simply add the [[Inject @Inject]] annotation for any dependency
that you want resolved.

```typescript
class Keeper {
  constructor( @Inject private readonly lunch?: FastFood ) {}
}

class Vet {}

class Zoo {
  constructor(
    @Inject private readonly keeper: Keeper,
    @Inject private readonly vet: Vet,
  ) {}
}

const zoo = await scorpion.fetch( Zoo )
zoo.keeper       // => an instance of a Keeper
zoo.vet          // => an instance of a Vet
zoo.keeper.lunch // => an instance of FastFood
```

All of your classes should be objects! And any dependency that is also an Object will
be fed.

## Configuration

A good scorpion should be prepared to hunt. An effort that describes _what_ the
scorpion can find for and _how_ it should be found. Scorpion uses Classes as
the primary means of identifying dependency in favor of opaque labels or
strings.  This serves two benefits:

1. The type of object expected by the dependency is clearly identified making it
   easier to understand what the concrete dependencies really are.
2. Types explicitly declare the expected behavioral contract of an object's
   dependencies.

Most scorpion hunts will be for an instance of a specific class (or a more
derived class). If you bind a more concrete implementation and ask for the base
class, the more concrete version will be used.

```typescript
class User {}
class Employee extends User {}

await scorpion.fetch( User )   // => new User()

scorpion.prepare( map => {
  map.bind( Employee )
})

await scorpion.fetch( User )   // => Employee.new()
```

### Builders

Sometimes resolving the correct dependencies is a bit more dynamic. In those
cases you can use a builder block to hunt for dependency.

```typescript
class Sword {}
class Samurai extends Sword {}
class Broad extends Sword {}

scorpion.prepare( map => {
  map.bind( Sword, async (fetcher, ...args) =>
    scorpion.fetch( Math.random() * 2 > 1 ? Samurai : Broad )
  )
})
```

Objects may also define their own static `.create` methods that receive a
[[Fetcher fetcher]] and arguments.

```typescript
class City {
  static async create( fetcher, name ): Promise<City> {
    let klass

    if( name == "New York" ) {
      klass = BigCity
    } else {
      klass = SmallCity
    }

    return fetcher.fetch( klass, name )
  }

  constructor( private readonly name: string ) {}
}

class BigCity extends City {}
class SmallCity extends City {}
```


### Singletons and Object Lifetimes

Scorpion allows you to capture dependency and feed the same instance to everyone that
asks for a matching dependency.

DI singletons are different then global singletons in that each scorpion can
have a unique instance of the class that it shares with all of its objects. This
allows, for example, global variable like support per HTTP request without polluting
the global namespace or dealing with thread concurrency issues.

```typescript
class Logger {}

scorpion.prepare( map => {
  map.capture( Logger )
}

await scorpion.fetch( Logger ) // => Logger.new
await scorpion.fetch( Logger ) // => Previously captured logger
```

> Captured dependencies are not shared with child scorpions (for example when
> conceiving scorpions from a [[Nest]]. To share captured dependency with
> children use [[BindingMap.share share]].

### Nests

A scorpion nest is where a mother scorpion lives and conceives young -
duplicates of the mother but maintaining their own captured singletons. You
might prepare a module scoped nest and then [[Nest.conceive conceive]] a new
Scorpion for each request. That way all preparation  performed by the mother is
shared with all the children it conceives so that configuration is established
when the application starts.

```typescript
const Logger {}
const SystemLogger extends Logger {}

const nest = new Nest( map => {
  map.bind( SystemLogger )
})

// In HTTP request startup code
await scorpion = nest.conceive()
await scorpion.fetch( Logger  ) // => SystemLogger.new
```

## Contributing

1. Fork it ( https://github.com/phallguy/scorpion-js/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request


## License

[The MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright (c) 2018 Paul Alexander

[@phallguy](http://twitter.com/phallguy) / http://phallguy.com
