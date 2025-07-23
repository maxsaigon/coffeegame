export class CoffeeChemistry {
    static calculateFlavor(temperature: number, _time: number) {
        let flavor = {
            acidity: 0,
            sweetness: 0,
            body: 0,
            bitterness: 0
        };

        if (temperature > 150 && temperature < 190) {
            flavor.acidity = (temperature - 150) / 40;
        }

        if (temperature > 170 && temperature < 210) {
            flavor.sweetness = (temperature - 170) / 40;
        }

        if (temperature > 190 && temperature < 230) {
            flavor.body = (temperature - 190) / 40;
        }

        if (temperature > 220) {
            flavor.bitterness = (temperature - 220) / 30;
        }

        return flavor;
    }
}