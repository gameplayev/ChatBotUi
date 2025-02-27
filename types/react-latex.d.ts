declare module 'react-latex' {
    import { FC, ReactNode } from 'react';

    interface LatexProps {
        children: string | ReactNode; // JSX도 허용하도록 수정
        className?: string;
    }

    const Latex: FC<LatexProps>;

    export default Latex;
}
