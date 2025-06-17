// Three ways to sum to n

// 1. Using a for loop
var sum_to_n_a = function(n) {
    var sum = 0;
    for (var i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// 2. Using the mathematical formula n(n + 1) / 2
var sum_to_n_b = function(n) {
    return (n * (n + 1)) / 2;
};

// 3. Using recursion
var sum_to_n_c = function(n) {
    return n === 0 ? 0 : n + sum_to_n_c(n - 1);
};