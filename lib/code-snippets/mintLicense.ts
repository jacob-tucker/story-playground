export const mintLicense = `
const { client } from './config.ts';
import { Address } from 'viem';

const licenseTermsId: string = ...
const licensorIpId: \`0x\${string}\` = ...
const receiver: Address = ...

const response = await client.license.mintLicenseTokens({
    licenseTermsId,
    licensorIpId,
    receiver,
    amount: 1,
    txOptions: { waitForTransaction: true, gasPrice: BigInt(10000000000) },
});

console.log(\`License minted at tx hash \${response.txHash}, License ID: \${response.licenseId}\`);
`;
