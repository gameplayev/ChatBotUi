'use client';
import { useState } from "react";
/**
 * 클래스 리스트를 State처럼 쓸 수 있습니다.
 * 
  * 
  * 
* classList // 클래스 리스트 값
* addStateClass // 클래스 리스트에 클레스 추가
* removeClass // 클래스 리스트에 클레스 뺴기
* IncludeStateClass // 클레스 리스트에 클레스 있는지 확인
 * 
 *
* 
* 사용 예시:
* const [classList, addClass, removeClass, IncludeStateClass] = useStateClassManager();
*/
export function useStateClassManager(): [
    string,  
    (newClass: string) => void, 
    (targetClass: string) => void,
    (targetClass: string) => boolean
] {
    const [classList, setClassList] = useState<string[]>([]);

    const addStateClass = (newClass: string) => {
        setClassList((prev) => (prev.includes(newClass) ? prev : [...prev, newClass]));
    };

    const removeStateClass = (targetClass: string) => {
        setClassList((prev) => prev.filter((cls) => cls !== targetClass));
    };
    
    const includeStateClass = (targetClass: string) => {
        return classList.includes(targetClass);
    };

    return [classList.join(" "), addStateClass, removeStateClass, includeStateClass];
}
