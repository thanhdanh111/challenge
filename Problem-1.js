// ## Problem 1: Three ways to sum to n

// **[PLAN-A] Implementation A: Using a Loop**
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// [PLAN-B]: Using the Arithmetic Series Formula
var sum_to_n_b = function(n) {
    return (n * (n + 1)) / 2;
};

// [PLAN-C]: Using Recursion
var sum_to_n_c = function(n) {
    if (n <= 0) return 0;
    return n + sum_to_n_c(n - 1);
};
