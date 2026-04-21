
export function conditionalHelper(...classes) {
    return classes.filter(Boolean).join(' ')
    
}