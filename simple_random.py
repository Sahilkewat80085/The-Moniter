import random
import datetime

print("Current date:", datetime.date.today())
print("Random numbers:")
for i in range(5):
    print(random.randint(1, 100))

print("Sum of first 10 numbers:")
total = 0
for i in range(1, 11):
    total += i
print(total)

def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

print("Factorial of 5:", factorial(5))

# Some more random stuff
colors = ["red", "blue", "green", "yellow"]
print("Random color:", random.choice(colors))

# Another loop
for j in range(3):
    print("Iteration", j+1, ":", random.uniform(0, 1))