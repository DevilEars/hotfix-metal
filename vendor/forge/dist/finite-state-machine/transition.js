export class Transition {
    predicates;
    constructor(...predicates) {
        this.predicates = predicates;
    }
    satisfies(input) {
        return this.predicates.every((predicate) => predicate(input));
    }
}
