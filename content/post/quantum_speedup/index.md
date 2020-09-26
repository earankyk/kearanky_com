---
title: Where does Quantum speedup come from? 
subtitle: Where does Quantum speedup come from?
summary: Where does Quantum speedup come from?
authors:
- admin
tags: [technology, quantum-computing, computer-science]
categories: [technology, quantum-computing, computer-science]
date: "2019-03-10T00:00:00Z"
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: ""
  focal_point: ""

---

## Brief intro to quantum computing
Quantum computing has surfaced into the limelight over the past few years. All the major cloud providers now offer quantum computers. With all this talk about quantum supremacy, I wanted to understand (and explain) how quantum algorithms were better than current algorithms. How exactly are we going to achieve *quantum supremacy*?

The fundamental difference between a classical computer and a quantum computer is the physics. A classical computer's bits can be in a state of 0 or 1. A quantum computer's *qubits* can be in a mixed state of 0 and 1 simultaneously. Measurement of the qubit *collapses* the qubit into 0 or 1 with a given probability. It's useful to think of a qubit in terms of a probability distribution:

| State | Amplitude | Probability |
|-------|-----------|-------------|
| 0     | 1/√2      | 1/2         |
| 1     | 1/√2      | 1/2         |

Probability here is the likelihood of getting that state when we measure the qubit. The amplitude is an artifact from the wave nature of quantum particles. Probability and amplitude obey the relation: `probability = amplitude²`

The qubit before measurement is represented as: `1/√2|0⟩ + 1/√2|1⟩`.

We can observe that a qubit actually captures 2 classical states (0, 1). This can be extended to show that an n-bit qubit captures 2ⁿ classical states. This property of qubits is known as *superposition*. All quantum algorithms leverage superposition to operate on multiple *classical* states in parallel to achieve speedup.

Another interesting property of qubits is their ability to *interfere*. When we combine two qubits (using a quantum gate), they may interfere *constructively* or *destructively*. 

![interference](./interference.png "Hello?" )

> It's easier to understand interference by considering qubits as waves. 

In order to form an intuition for qubit interference, let's consider a coin flip experiment. For a typical coin, the probability of getting a heads or tails on a flip is 1/2. 

Now let's consider a quantum coin. Let's say we begin with the coin facing heads up: `1|H> + 0|T>`. 

We flip the coin by applying a quantum gate (called Hadamard). The Hadamard gate brings the coin into a uniform superposition state (all outcomes are measured with equal probability): `1/√2|H⟩ + 1/√2|T⟩`. 

The state of the coin can be represented by the following distribution:

| State | Amplitude | Probability |
|-------|-----------|-------------|
| H     | 1/√2      | 1/2         |
| T     | 1/√2      | 1/2         |

So far the quantum coin behaves exactly like a classical coin. But when we flip the coin again by applying the same Hadamard gate, we notice something different. The coin always flips to head!

![negative_interference](./negative_interference.png)

This happens because of negative interference. The hadamard gate treats the `T` state differently than the `H` state. Think of the hadamard gate as the following function:

```
def hadamard(state):
  return state == H ? H+T:H-T
```

Since we started from the `H` state we don't notice any interference after the first flip. But when we flip the superposed state, the resulting `T` states interfere negatively, while the `H` states interfere positively. Resulting in the end state always being `H`. 

Now that we understand both superposition and interference, we're ready to understand how (most) quantum algorithms work!

A typical quantum algorithm works as follows:  

* Put the input qubits into a uniform superposed state.
* Apply quantum gates causing the states to interfere, transforming the amplitudes (and therefore the probabilities) of the qubits to our desired state.
* Measure the output qubits (collapsing the qubit into a classical bit).

For the purpose of this article, we will consider Grover's search algorithm. Finding an element in a list of n unsorted elements is a well known, commonly occuring problem. 

In the classical case, we need to go through n-1 elements in the worst case before we find the element, meaning O(n) worst case time. However, using Grover's search algorithm we can find the element in O(√n) time (with a high probability).

So how exactly does Grover's algorithm achieve this speedup?

## Grover's search algorithm 

To analyze Grover's algorithm, let's consider an oracle. We guess an element in the list, and the oracle tells us if the guess is correct.

```
def oracle(guess, answer):
  return guess == unsorted_list[answer];
```

You might ask - why bother with searching the list if we already know the answer. We'll look at more interesting cases where the oracle is not as simple in the subsequent sections.

In the classical search algorithm, we care about the input. We ask the question: 

> What input can I pick so the oracle responds with true? 

In Grover's algorithm, we don't care about the input (we can start from any state). We ask a different question: 

> How do I use the oracle to increase the probability of the answer state from the set of all possible inputs?

This change of question (also called change of basis) is enabled by superposition. Quantum states can reliably stay in a superposed state while classical states cannot. 

To simulate such a change of question using a classical algorithm, for an n-bit qubit, we'd require 2ⁿ iterations to generate and O(2ⁿ) space to store the generated state. An n-bit qubit can be put into a superposed state in O(1) time using O(1) space.

Let's consider a 4 element list `[0, 1, 2, 3]`. And let's say that the element we're searching for is `3`. 

Grover's search algorithm begins with the `|0>` state and uses the hadamard gate to put the input into a combination of all possible states with equal probability. 

            |0> ---Hadamard---> 1/2(|0> + |1> + |2> + |3>)

The probability distribution of the resulting state is:

| State | Amplitude | Probability |
|-------|-----------|-------------|
| 0     | 1/2       | 1/4         |
| 1     | 1/2       | 1/4         |
| 2     | 1/2       | 1/4         |
| 3     | 1/2       | 1/4         |

We need a way to separate the `|3>` state from the other input states. The oracle comes to our rescue!

Grover's algorithm constructs a quantum gate (GSG) that operates on the superposed state: 

```
def grovers_separation_gate(superposed_state):
  transformed_state = []
  for state, amplitude in superposed_state:
    transformed_state.push(oracle(state) ? -1*amplitude : amplitude);
  return transformed_state
```
`Note:` It may appear that we're dealing with O(N) complexity based on the code. However, to a quantum gate, a superposed state is no different than an unsuperposed state. An n-qubit quantum gate operates on the n-qubit *state* in O(1) time. It helps to think of the quantum gates as operating on all the states in a superposition in parallel. So in practice, the GSG operation takes O(1) time.

          1/2(|0> + |1> + |2> + |3>) ---GSG---> 1/2(|0> + |1> + |2> - |3>)

| State | Amplitude  | Probability |
|-------|------------|-------------|
| 0     | 1/2        | 1/4         |
| 1     | 1/2        | 1/4         |
| 2     | 1/2        | 1/4         |
| 3     | -1/2       | 1/4         |

Note that the Grover's separation gate doesn't change the probability of the states. This is not a coincidence. A quantum gate can only do a *unitary* transformation. A unitary transformation preserves the total probability of the input states. This makes sense since we only expect to find one of `[0, 1, 2, 3]`, therefore their probabilities should sum to `1`. 

Now we need a way to increase the probability of state `|3>`. Grover's algorithm uses *amplitude amplification* to achieve this. Amplitude amplification inverses the amplitudes about their mean.

```
def amplitude_amplification_gate(state):
  transformed_state = [];
  mean_amplitude = 0
  for amplitude in state:
    mean_amplitude += amplitude;
  for amplitude in state:
    transformed_state.push(2*mean_amplitude - amplitude)
  return transformed_state;
```

After applying Grover's amplitude amplification gate to our input, we get the following output:

| State | Amplitude  | Probability |
|-------|------------|-------------|
| 0     | 0          | 0           |
| 1     | 0          | 0           |
| 2     | 0          | 0           |
| 3     | 1          | 1           |

          1/2(|0> + |1> + |2> - |3>) ---AAG--->  |3>

In this case we reached our answer with a probability of 1 with just 1 application of the GSG and AAG gates. But in general, each application of the GSG and AAG gates increases the amplitude of our answer state by 1/√n. Therefore we need √n iterations to increase the probability of the answer to 1. 

So the grover's algorithm looks like this:
```
def grovers_algorithm(unsorted_list):
  list_size = length(unsorted_list)
  # Two bits for a list of size 4
  uniform_superposition = hadamard(log(list_size), 2)) 
  input_state = uniform_superposition
  for i in range(sqrt(list_size)):
    input_state = GSG(input_state)
    input_state = AAG(input_state)
  return measure(input_state)
```

The time complexity of GSG is O(1). The time complexity of AAG is O(1) too. So the overall time complexity of Grover's algorithm is O(√N), which is a quadratic speedup over the classical O(N) algorithm.

## Grover's algorithm in practice 

The Grover's oracle we constructed earlier encodes the answer. If we think of our search problem as searching a database for an element, the oracle is an encoding of the database itself. Clearly we need O(N) additional work to build the oracle based on the database. What's the point of Grover's algorithm, if we need to spend O(N) time building the oracle anyway?

The real power of Grover's algorithm lies in the nature of the oracle. Notice how Grover's algorithm always guarantees to find the solution in O(√N) iterations regardless of what the oracle is. What if the oracle was not a simple `=` checker, but something more complex? 

Let's consider the problem of finding the first prime number in an unordered list. We modify our oracle as follows:

```
def oracle(state):
  
```

**Grover’s algorithm gives a free quadratic speedup for any search problem.** 

## Code for Grover's search algorithm.
## What does the quantum speedup mean?