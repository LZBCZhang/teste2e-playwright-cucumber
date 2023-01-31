import { CustomWorld } from '../../world';
import { Before, Given, Then, When } from '@cucumber/cucumber';
import expect from 'expect';

Given('I have a simple maths calculator', async function (this: CustomWorld) {
});

Given('a variable is set to {int}', async function (this: CustomWorld, value: number) {
  expect("").toBe(value);
});

When('I increment this variable by {int}', async function (this: CustomWorld, value: number) {
  expect("").toBe(value);
});

Then('the variable should contain {int}', async function (this: CustomWorld, value: number) {
  expect("").toBe(value);
});

/**
 * Before each scenario hook
 */
Before({ tags: '@foo' }, async function (this: CustomWorld) {
  this.foo = true;
});
