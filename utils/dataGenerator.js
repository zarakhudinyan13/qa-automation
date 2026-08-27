export function generateUniqueEmail(prefix = 'qa.student') {
  const timestamp = Date.now();
  return `${prefix}.${timestamp}@automation.test`;
}

export function generateUser(overrides = {}) {
  const uniqueId = Date.now();
  return {
    name: `QA User ${uniqueId}`,
    email: generateUniqueEmail(),
    password: 'Password123!',
    title: 'Mr',
    birthDay: '10',
    birthMonth: '5',
    birthYear: '1990',
    firstName: 'QA',
    lastName: `Student${uniqueId}`,
    company: 'Automation Inc',
    address1: '123 Test Street',
    address2: 'Suite 100',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90001',
    mobile: '1234567890',
    newsletter: true,
    offers: true,
    ...overrides,
  };
}

export function toApiUserPayload(user) {
  return {
    name: user.name,
    email: user.email,
    password: user.password,
    title: user.title,
    birth_date: user.birthDay,
    birth_month: user.birthMonth,
    birth_year: user.birthYear,
    firstname: user.firstName,
    lastname: user.lastName,
    company: user.company,
    address1: user.address1,
    address2: user.address2,
    country: user.country,
    state: user.state,
    city: user.city,
    zipcode: user.zipcode,
    mobile_number: user.mobile,
  };
}
