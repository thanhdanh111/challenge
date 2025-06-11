## Problem 3: Messy React

## Major Issues Identified

### 1. **Critical Logic Error**

- **Issue**: `lhsPriority` is used but never defined - this will cause a runtime error
- **Location**: Line in filter function: `if (lhsPriority > -99)`
- **Impact**: Code will crash when executed


### 2. **Inverted Filter Logic**

- **Issue**: The filter logic is backwards - it keeps balances with amount ≤ 0 and discards positive balances
- **Expected**: Should filter OUT zero/negative balances, not keep them
- **Impact**: Displays empty wallets instead of wallets with funds


### 3. **Missing useMemo Dependencies**

- **Issue**: `getPriority` function is used in `useMemo` but not included in dependency array
- **Impact**: Stale closures and potential bugs if `getPriority` logic changes


### 4. **Inefficient Double Iteration**

- **Issue**: `sortedBalances` is mapped twice - once for formatting, once for rendering
- **Impact**: Unnecessary O(n) operation, poor performance with large datasets


### 5. **Type Inconsistency**

- **Issue**: `sortedBalances` contains `WalletBalance` objects, but `rows` mapping expects `FormattedWalletBalance`
- **Impact**: TypeScript errors and potential runtime issues


### 6. **Anti-pattern: Index as Key**

- **Issue**: Using array index as React key: `key={index}`
- **Impact**: Poor React reconciliation, potential rendering bugs when list changes


### 7. **Unused Dependencies**

- **Issue**: `prices` is included in `useMemo` dependencies but not used in the computation
- **Impact**: Unnecessary re-computations when prices change


### 8. **Missing Properties**

- **Issue**: `WalletBalance` interface lacks `blockchain` property that's used throughout the code
- **Impact**: TypeScript errors


### 9. **Incomplete Sort Logic**

- **Issue**: Sort function doesn't handle the case where priorities are equal
- **Impact**: Unstable sorting behavior
