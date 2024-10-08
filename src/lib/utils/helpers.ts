export const getRandomInEnum = <T>(anEnum: T): T[keyof T] => {
	const enumValues = Object.values(anEnum as object) as unknown as T[keyof T][];
	const randomIndex = Math.floor(Math.random() * enumValues.length);
	return enumValues[randomIndex];
};
