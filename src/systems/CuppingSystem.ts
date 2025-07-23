// import { FlavorWheel } from '../utils/FlavorWheel';
import { CuppingStandards } from '../data/CuppingStandards';

export class CuppingSystem {
    static assessQuality(roastProfile: any) {
        let score = 0;
        let feedback: string[] = [];

        // Basic quality assessment based on roast profile and standards
        if (roastProfile.temperature < 180) {
            score -= 2;
            feedback.push('Under-roasted: lacks development.');
        } else if (roastProfile.temperature > 230) {
            score -= 2;
            feedback.push('Over-roasted: burnt flavors.');
        }

        // Example: Assess flavor based on temperature and time
        const flavor = roastProfile.flavor;
        if (flavor.acidity > 0.8) {
            score += CuppingStandards.SCAA.attributes.acidity;
            feedback.push('Good acidity.');
        } else if (flavor.bitterness > 0.5) {
            score += CuppingStandards.SCAA.defects.bitter;
            feedback.push('Too bitter.');
        }

        // More complex logic would involve comparing against ideal profiles and customer preferences

        return { score, feedback };
    }
}