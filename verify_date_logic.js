const date = new Date("2026-05-15T00:00:00"); // Simulate date picker return (midnight local of that day usually, or just a date object)
// Actually date picker returns a Date object. Let's assume it returns midnight local time for the selected date.
// But wait, the component uses `date` from state.
// Let's reset to a fixed known date for testing.
const testDate = new Date(2026, 4, 15); // Month is 0-indexed: May is 4. Local midnight.

const startTime = "10:00";
const endTime = "12:00";

function testLogic(timezone) {
    const year = testDate.getFullYear();
    const month = testDate.getMonth();
    const day = testDate.getDate();

    const [startHours, startMinutes] = startTime.split(":").map(Number);

    let result;
    if (timezone === "accra") {
        const start = new Date(Date.UTC(year, month, day, startHours, startMinutes));
        result = start.toISOString();
    } else {
        const start = new Date(year, month, day, startHours, startMinutes);
        result = start.toISOString();
    }
    return result;
}

console.log("Testing Logic:");
console.log(`Local Timezone Offset: ${new Date().getTimezoneOffset()} minutes`);

const accraResult = testLogic("accra");
console.log(`Accra (GMT) Expectation: 2026-05-15T10:00:00.000Z`);
console.log(`Accra (GMT) Result:      ${accraResult}`);

const localResult = testLogic("local");
// Calculate expected local result manually
const expectedLocal = new Date(2026, 4, 15, 10, 0).toISOString();
console.log(`Local Result:            ${localResult}`);
console.log(`Expected Local:          ${expectedLocal}`);

if (accraResult === "2026-05-15T10:00:00.000Z") {
    console.log("SUCCESS: Accra logic is correct.");
} else {
    console.log("FAILURE: Accra logic is incorrect.");
}

if (localResult === expectedLocal) {
    console.log("SUCCESS: Local logic is correct.");
} else {
    console.log("FAILURE: Local logic is incorrect.");
}
