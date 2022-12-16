const assert = require('assert');
import * as anchor from '@project-serum/anchor';
import { AnchorProvider, web3 } from '@project-serum/anchor';
const {SystemProgram} = web3;
describe('mycalculatordapp', () => {
    const provider = AnchorProvider.local();
	anchor.setProvider(provider);
	const calculator = anchor.web3.Keypair.generate();
	const program = anchor.workspace.Mycalculatordapp;

    it('Creates a calculator', async() => {
        await program.rpc.create("Welcome to Solana",{
            accounts: {
                calculator: calculator.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId
            },
            signers: [calculator]
        })

        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.greeting === "Welcome to Solana")
    })

    it('Adds two numbers', async() => {
        await program.rpc.add(new anchor.BN(2), new anchor.BN(3),{
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(5)))
    })

    it('Subtract two numbers',async() => {
        await program.rpc.subtract(new anchor.BN(6), new anchor.BN(2),{
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(4)))
    })

    it("Multiplies two numbers", async function () {
		await program.rpc.multiply(new anchor.BN(2), new anchor.BN(3), {
			accounts: {
				calculator: calculator.publicKey,
			},
		});

		const account = await program.account.calculator.fetch(calculator.publicKey);
		assert.ok(account.result.eq(new anchor.BN(6)));
	});

    it('Divide two numbers', async() => {
        await program.rpc.divide(new anchor.BN(21), new anchor.BN(5),{
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(4)) && account.remainder.eq(new anchor.BN(1)))
    })
})
