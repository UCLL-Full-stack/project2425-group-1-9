import jwt from 'jsonwebtoken';
import { Role } from '../types';

// Q& Why the use of types here?
const generateJwtToken = ({ username, role }: { username: string, role: Role }): string => {
    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'veso_app' }

    try {
        // return jwt.sign({ username }, process.env.JWT_SECRET, options); // Q& This is shown in the video, but does not work.
        return jwt.sign({ username, role }, `${process.env.JWT_SECRET}`, options);
    } catch (error) {
        console.log(error);
        throw new Error("Error generating JWT token, see server log for details.");
    }
};

export { generateJwtToken };