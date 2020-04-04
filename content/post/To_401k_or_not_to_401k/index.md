---
title: To 401k or not to 401k 
subtitle: A webapp to help you decide if you should go with a 401k or an after-tax brokerage account.
summary: A webapp to help you decide if you should go with a 401k or an after-tax brokerage account.
authors:
- admin
tags: [finance]
categories: [finance]
date: "2019-02-05T00:00:00Z"
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: ""
  focal_point: ""

---

As an immigrant in the US, I have two options for investing in a US brokerage account:

* An **after-tax brokerage account** which provides with the flexibility of being able to withdraw your money whenever you want.
* A **tax-advantaged account** (like the 401k) in which you invest with pre-tax money knowing that you'd have to pay an early withdrawal penalty for making a withdrawal before you turn 65.  

It's a no-brainer to invest using a tax-advantaged account if you expect to be in the US by the time you're 65. However, as immigrants on worker visas we rarely know if that's the case. It's also a no-brainer to invest in your 401k to get a company match. This post is about deciding which account type to choose for further investments.


Each of these options also comes with it's own tax implications. A few observations about the two methods: 

#### Tax-advantaged accounts
* Since you're investing pre-tax money with a 401k, you'll invest more money in a tax-advantaged account over an after-tax account. Thus the power of compounding interest will work better in your favor over the long run in a tax-advantaged account.
* There is an upper-limit to how much you can contribute to a tax-advantaged account per year set by the IRS. At the time of writing this post it's $19000. 
* At the time of writing this post there's a 10% early withdrawal penalty on withdrawals made before you turn 65 from a tax-advantaged account. You'll also need to pay income tax on all the amount you withdraw from your account.

#### After-tax brokerage accounts
* You need to pay a long-term capital gains tax for all the profits made on your after-tax account when you sell your investments.
* The biggest draw for an after-tax brokerage account is the flexibility to sell your investments whenever you want. 

In-order to aid my decision making, I built this webapp to compare the returns from investing the same amount of pre-tax money in a tax advantaged account vs. an after-tax brokerage account.

Feel free to use [this code](https://github.com/earankyk/401k_helper) as a starting point to build your own comparisons!

### Tax Advantaged vs After Tax Returns
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Tax Advantaged vs After Tax Returns</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.3.0/Chart.min.js"></script>
  <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body onload="displayBarChart();">
  <div class="form-inline">
    <form>
      <label for="pre_tax_amount">Pre-tax investment amount (per year):</label><br>
      <input value=42000 id="pre_tax_amount"><br>
      <label for="expected_cagr">Expected CAGR (%)</label><br>
      <input type="text" id="expected_cagr" value=7><br>
      <label for="contribution_limit">401k contribution limit</label><br>
      <input type="text" id="contribution_limit" value=19000><br>
      <label for="total_income_tax_rate">Income tax rate (%)</label><br>
      <input type="text" id="total_income_tax_rate" value=31><br>
      <label for="total_capital_gains_rate">Capital gains tax rate (%)</label><br>
      <input type="text" id="total_capital_gains_rate" value=21><br>
      <label for="early_withdrawal_penalty_rate">Early withdrawal penalty rate (%)</label><br>
      <input type="text" id="early_withdrawal_penalty_rate" value=10><br>
      <input type="button" value="Compare Returns" onclick="displayBarChart()">
    </form>
  </div>
  <div class="box">
    <canvas id="barChart" height="450" width="800"></canvas>
  </div>
  <script src="script.js"></script>
</body>
</html>